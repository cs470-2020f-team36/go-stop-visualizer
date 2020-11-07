import React from "react";
import { connect } from "redux-zero/react";
import actions from "../actions";
import { AppState } from "../store";

type NotFoundProps = {};
const NotFound: React.FC<NotFoundProps> = () => {
  return <div className="w-full h-full">Not found</div>;
};

export default connect<AppState>((s) => s, actions)(NotFound);
