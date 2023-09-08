const express = require("express");
const router = express.Router();
const controller = require("../controller");
const authorizationMiddleware = require("../middleware/auth");

// routes for contacts
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

// routes for users
router.post("/users/signup", controller.signUp);

router.post("/users/login", controller.logIn);

router.get("/users/logout", authorizationMiddleware, controller.logOut);

router.get("/users/current", authorizationMiddleware, controller.currentUser);

module.exports = router;
