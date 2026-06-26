import { Url } from '../models/url.model.js';
import { generateShotId } from '../utils/utils.js';

export async function generateShortUrl(req, res) {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Url is required'
            });
        }

        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid URL",
            });
        }

        let shortId;

        do {
            shortId = generateShotId(6);
        } while (await Url.exists({ shortId }));

        await Url.create({
            shortId,
            url,
            visitHistory: [],
        });

        return res.status(201).json({
            success: true,
            message: 'Id is created',
            data: {
                shortId,
                shortUrl: `${req.protocol}://${req.get("host")}/api/${shortId}`,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.message}` || 'Internal Server Error',
        });
    }
};

export async function getShortUrl(req, res) {
    try {
        const { id } = req.params;

        const url = await Url.findOneAndUpdate(
            { shortId: id },
            {
                $inc: {
                    totalClicks: 1,
                },
                $push: {
                    visitHistory: {
                        timestamp: new Date(),
                    },
                },
            },
            {
                returnDocument: "after",
            }
        );

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "Short URL not found",
            });
        }

        return res.redirect(url.url);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export async function updateShortUrl(req, res) {
    try {
        const { id } = req.params;
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid URL",
            });
        }

        const updated = await Url.findOneAndUpdate(
            { shortId: id },
            {
                url,
            },
            {
                returnDocument: "after",
            }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Short URL not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "URL updated successfully",
            data: updated,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export async function deleteShortUrl(req, res) {
    try {
        const { id } = req.params;

        const deleted = await Url.findOneAndDelete({
            shortId: id,
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Short URL not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Short URL deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export async function getUrlStatistics(req, res) {
    try {
        const { id } = req.params;

        const url = await Url.findOne({ shortId: id });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "Short URL not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                shortId: url.shortId,
                originalUrl: url.url,
                shortUrl: `${req.protocol}://${req.get("host")}/api/${url.shortId}`,
                totalClicks: url.totalClicks,
                createdAt: url.createdAt,
                updatedAt: url.updatedAt,
                visitHistory: url.visitHistory,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};