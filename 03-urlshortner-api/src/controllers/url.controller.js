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
                shortUrl: `${req.protocol}://${req.get("host")}/${shortId}`,
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

        const data = await Url.findOne({ shortId: id });

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Url not found"
            });
        }

        data.visitHistory.push({
            timeStamp: Date.now(),
        });

        await data.save();

        return res.redirect(data.url);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.message}` || 'Internal Server Error',
        });
    }
}