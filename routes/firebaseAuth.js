
const router = require("express").Router();

router.get("/", async (req, res) => {
  return res.json({
    todos: [
      {
        title: "Task1",
      },
      {
        title: "Task2",
      },
      {
        title: "Task3",
      },
    ],
  });
});

module.exports = router;
