import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "./../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsers COntroller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = res.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage)

  } catch (error) {
    console.log("Error in sendMessage Controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
