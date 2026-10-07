import UrlModel from "../model/url.model.js";
import generateUniqueCode from "../utils/url.utils.js";

export const createShortUrl = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(404).json({
            message : "Please enter a url",
        });
    };

    if (!(url.startsWith("http://")) && !(url.startsWith("https://"))) {
        return res.status(404).json({
            message : "Please enter a valid url",
        });
    };

    if (url.length > 2048) {
        return res.status(404).json({
            message : "URL is too long",
        });
    };

    const shortCode = generateUniqueCode();

    const data = await UrlModel.create({
        originalUrl : url,
        shortUrl : shortCode,
    });

    res.status(201).json({
        message : "Short URL created successfully",
        data
    });
};

export const getAllUrls = async (req, res) => {
    const data = await UrlModel.find();

    res.status(200).json({
        message : "All Url's fetched successfully",
        data
    });
};

export const deleteUrl = async (req, res) => {
    const { id } = req.params;

    const deletedUrl = await UrlModel.findByIdAndDelete(id);

    res.status(201).json({
        message : "Url Deleted Successfully",
        deleteUrl,
    });
};

export const redirectUrl = async (req, res) => {
    const { code } = req.params;

    const data = await UrlModel.findOne({
        shortUrl : code,
    });

    if (!data) {
        return res.status(404).json({
            message : "Invalid URL Generated"
        });
    };

    res.redirect(302, data.originalUrl);

    await UrlModel.findByIdAndUpdate(
        data._id,
        { $inc : { clicks : 1 } }
    );
};