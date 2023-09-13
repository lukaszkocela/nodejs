const express = require("express");
const router = express.Router();
const controller = require("../controller");
const authorizationMiddleware = require("../middleware/auth");
const upload = require("../middleware/multer");

router.get("/contacts", authorizationMiddleware, controller.get);

router.get("/contacts/:id", authorizationMiddleware, controller.getById);

router.post("/contacts", authorizationMiddleware, controller.create);

router.put("/contacts/:id", authorizationMiddleware, controller.update);

router.patch(
  "/contacts/:id/favorite",
  authorizationMiddleware,
  controller.updateFavorite
);

router.delete("/contacts/:id", authorizationMiddleware, controller.remove);

router.post("/users/signup", controller.signUp);

router.post("/users/login", controller.logIn);

router.get("/users/logout", authorizationMiddleware, controller.logOut);

router.get("/users/current", authorizationMiddleware, controller.currentUser);

router.patch(
  "/users/avatars",
  authorizationMiddleware,
  upload.single("avatar"),
  controller.updateAvatar
);

module.exports = router;
