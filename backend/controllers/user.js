// import {createError} from "../error";
import {createError} from "../error.js";
import Users from "../models/Users.js";

export const update = async (req, res, next) => {
  // console.log(req.params.id);
  // console.log(req.user.id);
  if (req.params.id === req.user.id) {
    //todo
    try {
      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {new: true}
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can update only your account!!"));
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can delete only your account!!"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await Users.findById(req.params.id);
    res.res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const subscribe = async (req, res, next) => {
  try {
    await Users.findByIdAndUpdate(req.user.id, {
      $push: {subscribedUsers: req.params.id},
    });
    await Users.findByIdAndUpdate(req.params.id, {
      $inc: {subscribers: 1},
    });
    res.status(200).json('Subscription successfull');
  } catch (error) {
    next(error);
  }
};
export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await Users.findByIdAndUpdate(req.user.id, {
        $pull: {subscribedUsers: req.params.id},
      });
      await Users.findByIdAndUpdate(req.params.id, {
        $inc: {subscribers: -1},
      });
      res.status(200).json("Unsubscription successful");
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: {likes: id},
      $pull: {dislikes: id},
    });
    res.status(200).json("The video has been liked.");
  } catch (err) {
    next(err);
  }
};
export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: {dislikes: id},
      $pull: {likes: id},
    });
    res.status(200).json("The video has been disliked.");
  } catch (err) {
    next(err);
  }
};
