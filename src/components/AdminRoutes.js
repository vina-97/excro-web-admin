import React from 'react'

function AdminRoutes() {
  return (
    <>
    <div className="content_wrapper dash_wrapper">
        <div className="dash_merchent_welcome">
            <div className="merchent_wlcome_content add-user">Admin Routes</div>
        </div>
        <div className="col-xs-12 bg-white">
            <div className="white_tab_wrap">
                <div className="white_tab_box">
                    <div className="clearfix">
                        <ul className="nav nav-tabs customized_tab m-b-20">
                            <li className="page_title">
                                 Added Routes
                            </li>
                        </ul>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                               Display Name:
                            </div>
                            <div className="col-sm-5">
                                <input
                                    type="text"
                                    name="display_name"
                                    className="form-control"
                                    id="display_name"
                                    placeholder="Enter Display Name"
                                    // value={admin_routes.display_name}
                                    // onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Group Name:
                            </div>
                            <div className="col-sm-5">
                                <input
                                    type="text"
                                    name="group_name"
                                    className="form-control"
                                    id="group_name"
                                    placeholder="Enter Group Name"
                                    // value={admin_routes.group_name}
                                    // onChange={handleChange}
                                   
                                />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Request Method:
                            </div>
                            <div className="col-sm-5">
                                <input
                                    type="text"
                                    name="request_method"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter Request Method"
                                    // value={admin_routes.request_method}
                                    // onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Route:
                            </div>
                            <div className="col-sm-5">
                                <input
                                    type="text"
                                    name="route"
                                    className="form-control"
                                    id="route"
                                    placeholder="Enter Route"
                                    // value={admin_routes.route}
                                    // onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                SideBar:
                            </div>
                           <div className='row'>
                       
                           <div className="col-sm-1">
                     
                                <input
                                    type="radio"
                                    name="sidebar"
                                    className="form-check-input"
                                    id="sidebar"
                                    placeholder="Enter Request Method"
                                    // value={admin_routes.request_method}
                                    // onChange={handleChange}
                                />
                                      <span className='control-label m-r-5'>Yes</span>
                            </div>
                            <div className="col-sm-1">
                          
                                <input
                                    type="radio"
                                    name="sidebar"
                                    className="form-check-input"
                                    id="sidebar"
                                    placeholder="Enter Request Method"
                                    // value={admin_routes.request_method}
                                    // onChange={handleChange}
                                />
                                  <span className='control-label m-r-5'>No</span>
                            </div>
                           </div>
                        </div>
                        <div className="form-group clearfix form-refrance-cls">
                            <div className="col-md-2 col-sm-3 col-xs-12 control-label ">
                                Enable:
                            </div>
                           <div className='row'>
                       
                           <div className="col-sm-1">
                     
                                <input
                                    type="radio"
                                    name="sidebar"
                                    className="form-check-input"
                                    id="sidebar"
                                    placeholder="Enter Request Method"
                                    // value={admin_routes.request_method}
                                    // onChange={handleChange}
                                />
                                      <span className='control-label m-r-5'>Yes</span>
                            </div>
                            <div className="col-sm-1">
                          
                                <input
                                    type="radio"
                                    name="sidebar"
                                    className="form-check-input"
                                    id="sidebar"
                                    placeholder="Enter Request Method"
                                    // value={admin_routes.request_method}
                                    // onChange={handleChange}
                                />
                                  <span className='control-label m-r-5'>No</span>
                            </div>
                           </div>
                        </div>
                     
                        <div className="col-md-12 text-center">
                            <button className="submitBtn" >Submit</button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </div>

</>
  )
}

export default AdminRoutes