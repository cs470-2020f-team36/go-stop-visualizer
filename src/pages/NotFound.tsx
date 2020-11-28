import React from "react";
import { connect } from "redux-zero/react";
import actions from "../actions";
import Layout from "../components/Layout";
import { AppState } from "../store";

type NotFoundProps = {};
const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <Layout>
      <div className="flex w-full h-screen text-center place-items-center place-content-center">
        <span className="text-gray-500 font-bold" style={{ fontSize: "10em" }}>
          ∄
        </span>
      </div>
    </Layout>
  );
};

export default connect<AppState>((s) => s, actions)(NotFound);
