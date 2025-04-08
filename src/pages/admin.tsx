import React from "react";
import Layout from "@theme/Layout";

export default function Admin() {
  return (
    <Layout title="Admin" description="Administration area">
      <div className="container margin-vert--lg">
        <h1>Administration</h1>
        <p>This area will show locally edited files.</p>
      </div>
    </Layout>
  );
}
