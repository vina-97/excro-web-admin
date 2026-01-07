import cookie from "react-cookies";

export default function () {
  //cookie.save('AdminWeb',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUNWRjdkRPc2hnYnpwMll2R211ekw5T0trWjd4cHNmRCIsImV4cCI6MTY5NjQzMTAwNiwiaWF0IjoxNjg4NjU1MDA2fQ.1z4qRZbsOOFrevSHm08xB_6HTM8ELH_DO0GYV8YvIIc")
  if (
    cookie.load("AdminWeb") === "" ||
    cookie.load("AdminWeb") === undefined ||
    cookie.load("AdminWeb") === "undefined" ||
    cookie.load("AdminWeb") === null
  ) {
    return false;
  } else {
    return true;
  }
}
