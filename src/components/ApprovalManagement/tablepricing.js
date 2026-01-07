<div className="row">
                <div className="col-xs-6">
                <div className="col-xs-12 pricing_head_sec pointer-cursor"><div className="pricing_head">Updated Changes</div>
                <div className="expand_sign"></div></div>
                <div className="col-xs-12 col-sm-12 col-md-12 ">
                    <div className="sub_heading">NEFT Fund Transfer - <span style={{color:"green"}}>No Changes</span></div>
                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                      <table className="upi_table">
                        <tr>
                          <th>Price Range</th>
                          <th>
                            <div className="row commission-row">
                              <div className="col-md-4 m-l-30">
                                Fixed Commission
                              </div>
                              <div className="col-md-5 m-l-41">
                                Percentage Commission
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">1 - 1000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_neft"
                                  value={merchant_pricing.settings_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_neft"
                                  value={merchant_pricing.percent_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                          {/*   <td>
                                                    <div className="input-group">
                                                        <input className="form-control" placeholder="" name="settings_neft" value={merchant_pricing.settings_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">1001 - 10000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great1_neft"
                                  value={merchant_pricing.settings_great1_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great1_neft"
                                  value={merchant_pricing.percent_great1_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                          {/* <td>
                                                    <div className="input-group"> 
                                                        <input className="form-control" placeholder="" name="settings_great1_neft" value={merchant_pricing.settings_great1_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">10001 -25000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great10_neft"
                                  value={merchant_pricing.settings_great10_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great10_neft"
                                  value={merchant_pricing.percent_great10_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                          {/*  <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great10_neft" value={merchant_pricing.settings_great10_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">Above 25000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great25_neft"
                                  value={merchant_pricing.settings_great25_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great25_neft"
                                  value={merchant_pricing.percent_great25_neft}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                          {/* <td>
                                                    <div className="input-group">    
                                                        <input className="form-control" placeholder="" name="settings_great25_neft" value={merchant_pricing.settings_great25_neft}
                                                        onChange={handleChange} type="text"/>
                                                        <span className="input-group-addon"><i className="fa fa-rupee"></i></span>  
                                                    </div>
                                                </td> */}
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12">
                    <div className="sub_heading">IMPS Fund Transfer - <span style={{color:"green"}}>No Changes</span></div>
                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                      <table className="upi_table">
                        <tr>
                          <th>Price Range</th>
                          <th>
                            <div className="row commission-row">
                              <div className="col-md-4 m-l-30">
                                Fixed Commission
                              </div>
                              <div className="col-md-5 m-l-41">
                                Percentage Commission
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">1 - 1000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_imps"
                                  value={merchant_pricing.settings_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_imps"
                                  value={merchant_pricing.percent_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                         
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">1001 - 10000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great1_imps"
                                  value={merchant_pricing.settings_great1_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great1_imps"
                                  value={merchant_pricing.percent_great1_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                        
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">10001 -25000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great10_imps"
                                  value={merchant_pricing.settings_great10_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great10_imps"
                                  value={merchant_pricing.percent_great10_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                        
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">Above 25000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great25_imps"
                                  value={merchant_pricing.settings_great25_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great25_imps"
                                  value={merchant_pricing.percent_great25_imps}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                     
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12">
                    <div className="sub_heading">UPI Fund Transfer - <span style={{color:"red"}}>Changed</span> </div>
                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                      <table className="upi_table">
                        <tr>
                          <th>Price Range</th>
                          <th>
                            <div className="row commission-row">
                              <div className="col-md-4 m-l-30">
                                Fixed Commission
                              </div>
                              <div className="col-md-5 m-l-41">
                                Percentage Commission
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">1 - 1000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_upi"
                                  value={merchant_pricing.settings_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_upi"
                                  value={merchant_pricing.percent_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                      
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">1001 - 10000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great1_upi"
                                  value={merchant_pricing.settings_great1_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great1_upi"
                                  value={merchant_pricing.percent_great1_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                   
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">10001 -25000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great10_upi"
                                  value={merchant_pricing.settings_great10_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great10_upi"
                                  value={merchant_pricing.percent_great10_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                      
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">Above 25000</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_great25_upi"
                                  value={merchant_pricing.settings_great25_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_great25_upi"
                                  value={merchant_pricing.percent_great25_upi}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                     
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12">
                    <div className="sub_heading">RTGS Fund Transfer - <span style={{color:"green"}}>No Changes</span></div>
                    <div className="col-md-12 col-sm-12 col-xs-12  m-t-10 form-refrance-cls">
                      <table className="upi_table">
                        <tr>
                          <th>Price Range</th>
                          <th>
                            <div className="row commission-row">
                              <div className="col-md-4 m-l-30">
                                Fixed Commission
                              </div>
                              <div className="col-md-5 m-l-41">
                                Percentage Commission
                              </div>
                            </div>
                          </th>
                        </tr>
                        <tr>
                          <td>
                            <span className="heading_table">Above 2 Lakhs</span>
                          </td>
                          <td>
                            <div className="commission-row">
                              <div className="input-group commission-row-input m-l-30">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="settings_rtgs"
                                  value={merchant_pricing.settings_rtgs}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-rupee"></i>
                                </span>
                              </div>
                              <i className="fa fa-plus m-t-10 fa-plus-icon"></i>
                              <div className="input-group commission-row-input">
                                <input
                                  className="form-control commission-row-input-group"
                                  placeholder=""
                                  name="percent_rtgs"
                                  value={merchant_pricing.percent_rtgs}
                                  onChange={handleChange}
                                  type="text"
                                />
                                <span className="input-group-addon">
                                  <i className="fa fa-percent"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                     
                      </table>
                    </div>
                  </div>
            

              {/*   <div
                  className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor"
                  onClick={() => ToggleEvent("upi_service")}
                >
                  <div className="pricing_head">UPI Service</div>
                  <div className="expand_sign">+</div>
                </div>
                <div
                  className={`col-xs-12 col-sm-6 col-md-4 ${
                    merchant_pricing.upi_service ? "" : "content"
                  }`}
                >
                  <div className="sub_heading">UPI Services</div>
                  <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        UPI ID Creation
                      </div>
                      <div className="col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="vpa_creation"
                            placeholder=""
                            value={merchant_pricing.vpa_creation}
                            onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <Switch
                              checked={merchant_pricing.vpa_creation_type}
                              // onChange={(e) => calculationTypeChange('vpa_creation_type',e) }
                              onColor="#86d3ff"
                              onHandleColor="#2693e6"
                              handleDiameter={22}
                              height={20}
                              width={48}
                              className="react-switch"
                              id="material-switch"
                              uncheckedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-percent"></i>
                                </div>
                              }
                              checkedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-rupee"></i>
                                </div>
                              }
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Collection to UPI ID
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="vpa_collection"
                            placeholder=""
                            value={merchant_pricing.vpa_collection}
                            onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <Switch
                              checked={merchant_pricing.vpa_collection_type}
                              // onChange={(e) => calculationTypeChange('vpa_collection_type',e) }
                              onColor="#86d3ff"
                              onHandleColor="#2693e6"
                              handleDiameter={22}
                              height={20}
                              width={48}
                              className="react-switch"
                              id="material-switch"
                              uncheckedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-percent"></i>
                                </div>
                              }
                              checkedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-rupee"></i>
                                </div>
                              }
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        UPI ID Verification
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="vpa_verification"
                            placeholder=""
                            value={merchant_pricing.vpa_verification}
                            onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <i className="fa fa-rupee"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor"
                  onClick={() => ToggleEvent("virtual_account")}
                >
                  <div className="pricing_head">Virtual Account</div>
                  <div className="expand_sign">+</div>
                </div>
                <div
                  className={`col-xs-12 col-sm-6 col-md-4 ${
                    merchant_pricing.virtual_account ? "" : "content"
                  }`}
                >
                  <div className="sub_heading">Virtual Account</div>
                  <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Create VAN
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="van_creation"
                            placeholder=""
                            value={merchant_pricing.van_creation}
                            onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <Switch
                              checked={merchant_pricing.van_creation_type}
                              // onChange={(e) => calculationTypeChange('van_creation_type',e) }
                              onColor="#86d3ff"
                              onHandleColor="#2693e6"
                              handleDiameter={22}
                              height={20}
                              width={48}
                              className="react-switch"
                              id="material-switch"
                              uncheckedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-percent"></i>
                                </div>
                              }
                              checkedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-rupee"></i>
                                </div>
                              }
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Collection
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="van_collection"
                            placeholder=""
                            value={merchant_pricing.van_collection}
                            onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <Switch
                              checked={merchant_pricing.van_collection_type}
                              // onChange={(e) => calculationTypeChange('van_collection_type',e) }
                              onColor="#86d3ff"
                              onHandleColor="#2693e6"
                              handleDiameter={22}
                              height={20}
                              width={48}
                              className="react-switch"
                              id="material-switch"
                              uncheckedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-percent"></i>
                                </div>
                              }
                              checkedIcon={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "orange",
                                    paddingRight: 2,
                                  }}
                                >
                                  <i className="fa fa-rupee"></i>
                                </div>
                              }
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Bank Verification
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="van_verification"
                            placeholder=""
                            value={merchant_pricing.van_verification}
                            onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <i className="fa fa-rupee"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-xs-12 pricing_head_sec m-t-10 pointer-cursor"
                  onClick={() => ToggleEvent("settings_section")}
                >
                  <div className="pricing_head">Settings</div>
                  <div className="expand_sign">+</div>
                </div>

                <div
                  className={`col-xs-12 col-sm-6 col-md-4 ${
                    merchant_pricing.settings_section ? "" : "content"
                  }`}
                >
                  <div className="sub_heading">Settings</div>
                  <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Daily Transaction Count
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="daily_trans_count"
                            placeholder=""
                            value={merchant_pricing.daily_trans_count}
                            onChange={handleChange}
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Daily Transaction Volume
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="daily_trans_volume"
                            placeholder=""
                            value={merchant_pricing.daily_trans_volume}
                            onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <i className="fa fa-rupee"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Amount per Transaction
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="per_trans_volume"
                            placeholder=""
                            // value={merchant_pricing.per_trans_volume}
                            // onChange={handleChange}
                            type="text"
                          />
                          <span className="input-group-addon">
                            <i className="fa fa-rupee"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 p-l-0 m-t-10">
                    <div className="form-group clearfix form-refrance-cls">
                      <div className="col-md-4 col-sm-6 col-xs-12 control-label ">
                        Max. Beneficiary
                      </div>
                      <div className=" col-md-6 col-sm-6 col-xs-12">
                        <div className="input-group">
                          <input
                            className="form-control"
                            name="max_beneficiary"
                            placeholder=""
                            // value={merchant_pricing.max_beneficiary}
                            // onChange={handleChange}
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                </div>
             
          </div>