const User = require('../models/userModel');
const JWT = require('jsonwebtoken');

//generate jwt token
const generateToken = (userId) => {
    return JWT.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
};

//register new user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({ success: true, data: { user, token } })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
        console.log(error)
    }
}

//login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password ' })
        }

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true, data: { user, token } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}

//logout 
exports.logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' })
}

//subscribe to another user
exports.subscribe = async (req, res) => {
    const { userId } = req.params;
    try {
        const userToSubscribe = await User.findById(userId);
        const currentUser = await User.findById(req.user._id);

        if (!userToSubscribe || currentUser.subscribedTo.includes(userToSubscribe._id)) {
            return res.status(400).json({ message: 'Already subscribed to this user' })
        }

        userToSubscribe.subscribers.push(currentUser._id);
        currentUser.subscribedTo.push(userToSubscribe._id);

        await userToSubscribe.save();
        await currentUser.save();

        res.json({ success: true, message: `Subscribed to ${userToSubscribe.username}` });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}

//unsubscribe 
exports.unsubscribe = async (req, res) => {
    const { userId } = req.params;
    try {
        const userToUnsubscribe = await User.findById(userId);
        const currentUser = await User.findById(req.user._id);

        if (!userToUnsubscribe || !currentUser.subscribedTo.includes(userToUnsubscribe._id)) {
            return res.status(400).json({ message: 'Not subscribed to this user' });
        }

        userToUnsubscribe.subscribers.pull(currentUser._id);
        currentUser.subscribedTo.pull(userToUnsubscribe._id);

        await userToUnsubscribe.save();
        await currentUser.save();
        res.json({ success: true, message: `Unsubscribed from ${userToUnsubscribe.username}` });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
};

//fetch user data along with their videos
exports.fetchUserData = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select('-password')
            .populate({
                path: 'videos',
                select: 'title thumbnailId',
                options: { sort: { createdAt: -1 } },
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const subscribersCount = user.subscribers.length;

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            videoCount: user.videos.length,
            subscribersCount,
            videos: user.videos.map(video => ({
                _id: video._id,
                title: video.title,
                thumbnailUrl: `/thumbnails/${video.thumbnailId}`,
            })),
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

