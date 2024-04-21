import { Flex, Spin } from "antd";

import React from "react";

const Loader = ({type}) => {
  return (
    <div className={`grid ${type=="comment"?"min-h-[220px]":"min-h-[87vh]"} justify-center items-center w-full`}>
      <Flex align="center" gap="middle">
        <Spin size="large" />
      </Flex>
    </div>
  );
};

export default Loader;