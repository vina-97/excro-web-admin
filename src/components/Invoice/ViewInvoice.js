import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Logo from "../../assets/images/rugr_white_logo.svg"
import ReactSelect from "react-select";
const ViewInvoice = () => {
    const Trans_Mode =[
        {value:"credit_card",label:"Credit Card"},
        {value:"debit_card",label:"Debit Card"},
        {value:"netbanking",label:"NetBanking"},
        {value:"upi",label:"UPI"}
    ]
  return (
    <div className="content_wrapper dash_wrapper">
 

      <div className="dash_merchent_welcome">
        <div className="merchent_wlcome_content">Preview Invoice 
              <div className="bread_crumb">
                  <ul className="breadcrumb">
                  <li ><Link to="/dashboard" className="inactive_breadcrumb">Home</Link></li>
                  <li className="active_breadcrumb">Preview</li>
              
                  </ul>
                  </div>
                  </div>
      </div>
      <div className="white_tab_wrap">
        <div className="white_tab_box">
          <div className="col-xs-12 p-0 ">
           
            <div className="invoice-contatiner"
          >
            <section className="invoice-block"
            >
              <div
                style={{
                  display: "flex",
                  fontWeight: "400",
                  justifyContent: "space-between",
                }}
              >
                <img src={Logo} alt="logo" height={60}/>
                <div>
                  <div>Invoice No :#INV0020</div>
                  <div>Period : Nov 2024</div>
                  <div className="invoice-status-border"
                  >
                    <span className="invoice-status-success">Paid</span>
                  </div>
                </div>
              </div>
              <div className="divLine"></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: "500" }}>Billed From:</div>
                  <div style={{ fontWeight: "500" }}>
                    Paycraft
                  </div>
                  <br />
                  <div>
                    <span style={{ fontWeight: "500" }}>Address:</span> A1,
                    2nd Floor,
                
                    <br /> Tamil Nadu, 600032.
                  </div>
                  <div>
                    <span style={{ fontWeight: "500" }}>GST:</span> 33AAFC8K1ZK
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: "500" }}>Billed To:</div>
                  <div>
                    <span style={{ fontWeight: "500" }}>Merchant ID:</span>Zduzw9WNOD
                  </div>
                  <div>
                    <span style={{ fontWeight: "500" }}>Name:</span> Adi Sk
                  </div>
                  <div>
                    <span style={{ fontWeight: "500" }}>Business Name:</span>{" "}
                     Agro Products
                  </div>
                  <div>
                    <span style={{ fontWeight: "500" }}>Address:</span> NO.186,
                    4B1A,Guindy Road,
                    <br />
                  
                    <br />
                    603302
                  </div>
                  <div>
                    <span style={{ fontWeight: "500" }}>GST:</span> 33AACCU2231L1ZJ
                  </div>
                </div>
              </div>
              <div className="divLine"></div>
      
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
     <thead>
      <tr style={{ width: "100%" }}>
        <th
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#000",
            textAlign: "left"
          }}
          colSpan={2}
        >
          Services
        </th>
        <th
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#000",
            textAlign: "center"
          }}
        >
          GST
        </th>
        <th
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#000",
            textAlign: "left"
          }}
        >
          Quantity
        </th>
        <th
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#000",
            textAlign: "left"
          }}
        >
          Transaction Amount
        </th>
        <th
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#000",
            textAlign: "center"
          }}
        >
          Charges
        </th>
      </tr>
    </thead>
    <tbody className="invoice_table">
      <tr >
        <td
          colSpan={6}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "left"
          }}
        >
          1. Payouts
        </td>
      </tr>
      <tr>
        <td
          colSpan={2}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 0",
            textAlign: "center"
          }}
        >
          IMPS
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "center"
          }}
        >
          18%
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          3
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 19.87
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 2.72
        </td>
      </tr>
      <tr>
        <td
          colSpan={2}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 0",
            textAlign: "center"
          }}
        >
          NEFT
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "center"
          }}
        >
          18%
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          80
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 3,65,142.87
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 94.40
        </td>
      </tr>
      <tr>
        <td
          colSpan={2}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 0",
            textAlign: "center"
          }}
        >
          UPI
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "center"
          }}
        >
          18%
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          0
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 0
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 0
        </td>
      </tr>
      <tr>
        <td
          colSpan={2}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 0",
            textAlign: "center"
          }}
        >
          RTGS
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "center"
          }}
        >
          18%
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          1
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 23.4
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 1.18
        </td>
      </tr>
      <tr style={{ width: "100%" }}>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "left"
          }}
        >
          2. Bank Account/ UPI ID Verfication
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "center"
          }}
          colSpan={2}
        >
          18%
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          2
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 0.36
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 2.36
        </td>
      </tr>
      <tr>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "left"
          }}
        >
          3. Virtual Account Creation
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "center"
          }}
          colSpan={2}
        >
          0
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          0
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 0
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 0
        </td>
      </tr>
      <tr>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "left"
          }}
        >
          4. Collection to VAN
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "center"
          }}
          colSpan={2}
        >
          0
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          0
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 3,65,500.00
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
        >
          ₹ 0
        </td>
      </tr>
      <tr>
        <td
          colSpan={6}
          style={{
            width: "100%",
            background: "#000000",
            height: 2,
            marginBottom: 15,
            marginTop: 15,
            padding: 0
          }}
        ></td>
      </tr>
      <tr>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
          colSpan={4}
        >
          Total
        </td>
        <td
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#000",
            padding: "12px 28px 12px 22px",
            textAlign: "right"
          }}
          colSpan={4}
        >
          ₹ 100.66
        </td>
      </tr>
    </tbody>
        </table>




  <div className="divLine"></div>   
  <div className="col-xs-12 m-b-10">
<div className="row">
    <div className="col-md-4">
        <div>Transaction UTR :</div>
        <div><input
                        type="text"
                        name="transaction_utr"
                        className="form-control"
                        id="transaction_utr"
                        placeholder="Enter UTR"
                   
                      /></div>
    </div>
    <div className="col-md-4">
        <div>Transaction Mode :</div>
        <div>
        <ReactSelect
                       options={Trans_Mode}
                        />
                      </div>
    </div>
    <div className="col-md-4">
        <div>Transaction Date and Time :</div>
        <div><input
                        type="text"
                        name="transaction_utr"
                        className="form-control"
                        id="transaction_utr"
                        placeholder="Enter UTR"
                      
                      /></div>
    </div>
   
</div>
<div className="row m-t-30">
<div className="col-md-4">
        <div>Bank Name :</div>
        <div>
                        <input
                        type="text"
                        name="transaction_mode"
                        className="form-control"
                        id="transaction_mode"
                        placeholder="Enter Transaction mode"

                        />
                      </div>
    </div>
    <div className="col-md-4">
        <div>Account Number :</div>
        <div><input
                        type="text"
                        name="account_number"
                        className="form-control"
                        id="account_number"
                        placeholder="Enter Account Number"
                      
                      /></div>
    </div>
  
    <div className="col-md-4">
        <div>IFSC :</div>
        <div><input
                        type="text"
                        name="account_number"
                        className="form-control"
                        id="account_number"
                        placeholder="Enter Account Number"
                      
                      /></div>
    </div>
</div>
<div className="textCenter m-t-20"><span className="submitBtn">Submit</span></div>
</div>
              <footer className="invoice-footer-sec">
                <div style={{ textAlign: "center" }}>
                  <div>
                    <span style={{ fontWeight: "500" }}>Contact :</span>
                    help@rugr.com
                  </div>
                  <div style={{ fontSize: "14px", marginTop: "6px" }}>
                    <span style={{ fontWeight: "600" }}>Note :</span> This is a
                    computer-generated invoice. It is valid and does not require an
                    authorized signature or seal.
                  </div>
                </div>
              </footer>
            </section>
          </div>

           
        
          
          </div>
        </div>
      </div>

    </div>
  );
};

export default ViewInvoice;
