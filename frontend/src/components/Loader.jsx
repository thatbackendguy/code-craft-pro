import { Flex, Spin } from "antd";

import React from "react";

const Loader = () => {
  return (
    <div className="grid min-h-[87vh] justify-center items-center w-full">
      <Flex align="center" gap="middle">
        <Spin size="large" />
      </Flex>
    </div>
  );
};

export default Loader;
