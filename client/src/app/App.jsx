
import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'

function App() {
  const [urls, setUrls] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [currentUrl, setCurrentUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function fetchUrls() {
    try {
      const response = await axios.get('/api/url/')
      setUrls(Array.isArray(response.data.data) ? response.data.data : [])
      setError('')
    } catch {
      setError('Could not load your links. Check that the server is running, then try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleRefresh() {
    setIsLoading(true)
    fetchUrls()
  }

  function shortLink(code) {
    return `http://${window.location.hostname}:3000/${code}`
  }

  async function handleCreate(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    let parsedUrl
    try {
      parsedUrl = new URL(inputValue.trim())
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error()
    } catch {
      setError('Enter a valid URL starting with https:// or http://.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/url/create', { url: parsedUrl.href })
      const createdUrl = response.data.data
      setCurrentUrl(createdUrl)
      setUrls((currentUrls) => [createdUrl, ...currentUrls])
      setInputValue('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not create the short link. Check the URL and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    setError('')
    try {
      await axios.delete(`/api/url/delete/${id}`)
      setUrls((currentUrls) => currentUrls.filter((url) => url._id !== id))
      setConfirmingId(null)
      if (currentUrl?._id === id) setCurrentUrl(null)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this link. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleCopy(id, code) {
    try {
      await navigator.clipboard.writeText(shortLink(code))
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((currentId) => currentId === id ? null : currentId), 1600)
    } catch {
      setError('Clipboard access is unavailable. Open the link and copy it from the address bar.')
    }
  }

  useEffect(() => {
    axios.get('/api/url/')
      .then((response) => {
        setUrls(Array.isArray(response.data.data) ? response.data.data : [])
        setError('')
      })
      .catch(() => {
        setError('Could not load your links. Check that the server is running, then try again.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Shortly home">
          <span className="brand-mark" aria-hidden="true">s</span>
          <span>shortly<span className="brand-period">.</span></span>
        </a>
        <span className="topbar-note">A quieter way to share</span>
      </header>

      <main className="main-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow"><span className="status-dot" /> LINK WORKSPACE</p>
          <h1 id="page-title">Long link.<br /><span>Short story.</span></h1>
          <p className="intro-copy">Make a clean, lasting link from any URL. No detours, just the part worth sharing.</p>

          <form className="shorten-form" onSubmit={handleCreate}>
            <label className="sr-only" htmlFor="long-url">Long URL</label>
            <input
              id="long-url"
              type="url"
              inputMode="url"
              placeholder="Paste a long URL to get started"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              maxLength={2048}
              required
            />
            <button type="submit" disabled={isSubmitting || !inputValue.trim()}>
              {isSubmitting ? <><span className="spinner" /> Shortening</> : <>Shorten <span aria-hidden="true">↗</span></>}
            </button>
          </form>
          <p className="form-hint">Works with any http or https address <span>·</span> Up to 2,048 characters</p>

          {error && <div className="message message-error" role="alert">{error}</div>}
          {notice && <div className="message message-success" role="status">{notice}</div>}

          {currentUrl && (
            <div className="result-panel" role="status">
              <div className="result-heading"><span className="result-check">✓</span><span>Your short link is ready</span></div>
              <div className="result-content">
                <a href={shortLink(currentUrl.shortUrl)} target="_blank" rel="noreferrer" className="result-link">
                  {window.location.hostname}:3000/{currentUrl.shortUrl}
                </a>
                <div className="result-actions">
                  <button type="button" className="button-quiet" onClick={() => handleCopy('latest', currentUrl.shortUrl)}>
                    {copiedId === 'latest' ? 'Copied' : 'Copy'}
                  </button>
                  <a className="button-quiet" href={shortLink(currentUrl.shortUrl)} target="_blank" rel="noreferrer">Open ↗</a>
                </div>
              </div>
              <p className="result-original" title={currentUrl.originalUrl}>{currentUrl.originalUrl}</p>
            </div>
          )}
        </section>

        <section className="links-section" aria-labelledby="links-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-eyebrow">YOUR WORKSPACE</p>
              <h2 id="links-title">Your links <span className="link-count">{isLoading ? '—' : urls.length}</span></h2>
            </div>
            <button className="refresh-button" type="button" onClick={handleRefresh} disabled={isLoading} aria-label="Refresh links" title="Refresh links">↻</button>
          </div>

          <div className="link-table" role="table" aria-label="Your shortened links">
            <div className="table-head" role="row">
              <span role="columnheader">SHORT LINK</span>
              <span role="columnheader">DESTINATION</span>
              <span role="columnheader">CLICKS</span>
              <span role="columnheader">ACTIONS</span>
            </div>

            {isLoading ? (
              <div className="loading-rows" aria-label="Loading links">
                {[0, 1, 2].map((item) => <div className="skeleton-row" key={item}><i /><i /><i /><i /></div>)}
              </div>
            ) : urls.length === 0 ? (
              <div className="empty-state">
                <span className="empty-mark" aria-hidden="true">↗</span>
                <p>No links yet.</p>
                <span>Create your first short link above.</span>
              </div>
            ) : (
              <div className="rows">
                {urls.map((url) => (
                  <div className="link-row" role="row" key={url._id}>
                    <div className="short-cell" role="cell">
                      <a href={shortLink(url.shortUrl)} target="_blank" rel="noreferrer" title={`Open ${url.shortUrl}`}>
                        <span className="external-mark" aria-hidden="true">↗</span>{url.shortUrl}
                      </a>
                    </div>
                    <div className="destination-cell" role="cell" title={url.originalUrl}>{url.originalUrl}</div>
                    <div className="click-cell" role="cell"><span className="mobile-label">CLICKS</span>{url.clicks ?? 0}</div>
                    <div className="row-actions" role="cell">
                      {confirmingId === url._id ? (
                        <div className="delete-confirm" role="group" aria-label="Confirm link deletion">
                          <span>Delete link?</span>
                          <button type="button" className="confirm-cancel" onClick={() => setConfirmingId(null)} disabled={deletingId === url._id}>Cancel</button>
                          <button type="button" className="confirm-delete" onClick={() => handleDelete(url._id)} disabled={deletingId === url._id}>
                            {deletingId === url._id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <button type="button" className="row-button" onClick={() => handleCopy(url._id, url.shortUrl)} aria-label={`Copy short link ${url.shortUrl}`}>
                            {copiedId === url._id ? 'Copied' : 'Copy'}
                          </button>
                          <button type="button" className="row-button row-delete" onClick={() => setConfirmingId(url._id)} aria-label={`Delete short link ${url.shortUrl}`}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <footer className="page-footer"><span>SHORTLY / URL MANAGEMENT</span><span>Keep it brief.</span></footer>
        </section>
      </main>
    </div>
  )
}

export default App
