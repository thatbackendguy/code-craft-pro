import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { LuSendHorizonal } from "react-icons/lu";
import Avatar from "react-avatar";
import Loader from "./Loader";

const CommentModal = ({
  visible,
  setVisible,
  comments,
  addComment,
  resolveComment,
  commentLoading,
}) => {
  const [comment, setComment] = useState("");
  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleResolve = (id) => {
    resolveComment(id);
  };

  const add = () => {
    addComment(comment);
    setComment("");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="comment">
      <Modal
        title="Comments"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <div className="min-h-[250px] max-h-[250px] overflow-y-auto">
          {commentLoading ? (
            <Loader type="comment" />
          ) : comments?.length > 0 ? (
            comments?.map((comment, index) => (
              <div key={index} className="px-4 py-2 rounded-lg my-6 mr-4">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center">
                    <Avatar
                      className="profile-avatar"
                      name={comment.user.name}
                      size="30"
                      round={true}
                    />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="text-gray-900 font-semibold">
                          {comment.user.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-blue-500 px-4 py-2 text-white rounded-full hover:cursor-pointer"
                      onClick={() => handleResolve(comment._id)}
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center flex justify-center items-center min-h-[250px] text-gray-500">
              No comments yet
            </div>
          )}
        </div>
        <br />
        <br />
        <div className="px-4 py-2 rounded-lg flex w-full gap-2">
          <input
            className="p-2 bg-white rounded-lg border w-full outline-none"
            placeholder="Add your comment"
            value={comment}
            onChange={handleChange}
          />
          <button
            onClick={add} disabled={comment.trim().length === 0}
            className={`flex items-center justify-center w-14 h-12 ${ comment.trim().length ==0 ?"bg-gray-500" :"bg-blue-500 hover:cursor-pointer"} rounded-full text-white hover:cursor-not-allowed`}
          >
            <LuSendHorizonal className="h-5 w-5" />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CommentModal;
