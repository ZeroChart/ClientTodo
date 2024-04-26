const mongoose = require("mongoose");

const ClientTodoSchema = new mongoose.Schema(
  {
    dateid: {
      type: String,
      required: [true, "작성일자 반드시 입력"],
    },
    client: {
      type: String,
      required: [true, "거래처명 반드시 입력"],
    },
    makename: {
      type: String,
      required: [true, "작성자 반드시 입력"],
    },
    title: {
      type: String,
      required: [true, "제목 반드시 입력"],
    },
    body: {
      type: String,
      required: [true, "내용 반드시 입력"],
    },
    result: {
      type: String,
    },
    deptname: {
      rtpe:String,
    },
    enddate: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
);

module.exports = mongoose.model("ClientTodoList", ClientTodoSchema);