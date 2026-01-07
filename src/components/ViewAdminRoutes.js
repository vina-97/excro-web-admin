import React, { useState } from "react";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import CheckboxTree from "react-checkbox-tree";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ViewAdminRoutes() {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  // Define your tree data
  const nodes = [
    {
      value: "transaction",
      label: "Transaction",
      children: [
        { value: "transaction-list", label: "Transaction List" },
        { value: "detail", label: "Transaction Detail" },
      ],
    },
    {
      value: "contact",
      label: "Contact",
      children: [
        { value: "contact-list", label: "Contact List" },
        { value: "contact-detail", label: "Contact Detail" },
      ],
    },
  ];

  // Handle checkbox change
  const handleCheck = (checked) => {
    setChecked(checked);
  };

  // Handle tree node expand/collapse
  const handleExpand = (expanded) => {
    setExpanded(expanded);
  };
  return (
    <div className="content_wrapper dash_wrapper">
      <div className="dash_merchent_welcome">
        <div className="merchent_wlcome_content add-user"> Routes</div>
      </div>
      <div className="col-xs-12 bg-white">
        <div className="white_tab_wrap">
          <div className="white_tab_box">
            <div className="clearfix">
              <ul className="nav nav-tabs customized_tab m-b-20">
                <li className="page_title">Added Routes<span className="text-center">
                <Link to="/add-admin-route" className="submitBtn m-l-10">Add</Link>
              </span></li>
              </ul>
              <div>
                <CheckboxTree
                  nodes={nodes}
                  checked={checked}
                  expanded={expanded}
                  onCheck={handleCheck}
                  onExpand={handleExpand}
                  showNodeIcon={false}
                />
              </div>

              {/* <div className="col-md-12 text-center">
                <button className="submitBtn">Save</button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewAdminRoutes;
