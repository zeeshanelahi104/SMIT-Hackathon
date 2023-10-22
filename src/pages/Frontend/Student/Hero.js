// import React, { useEffect, useState } from "react";
// import {
//   Avatar,
//   Button,
//   Col,
//   DatePicker,
//   Divider,
//   Form,
//   Image,
//   Input,
//   Modal,
//   Row,
//   Select,
//   Space,
//   Tooltip,
//   message,
// } from "antd";
// import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { firestore } from "config/firebase";
// import { useAuthContext } from "contexts/AuthContext";

// export default function Hero() {
//   const { user } = useAuthContext();
//   const [allDocuments, setAllDocuments] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [status, SetStatus] = useState("active");

//   const navigate = useNavigate();

//   const getStudents = async () => {
//     const q = query(
//       collection(firestore, "students"),
//       where("createdBy.uid", "==", user.uid)
//     );

//     const querySnapshot = await getDocs(q);
//     const array = [];
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       let data = doc.data();
//       array.push(data);
//     });
//     setAllDocuments(array);
//     setDocuments(array);
//   };

//   useEffect(() => {
//     getStudents();
//   }, []);

//   useEffect(() => {
//     const filteredDocuments = allDocuments.filter(
//       (student) => student.status === status
//     );
//     setDocuments(filteredDocuments);
//   }, [allDocuments, status]);
//   const handleDelete = async (student) => {
//     try {
//       await deleteDoc(doc(firestore, "students", student.id));

//       let documentsAfterDelete = documents.filter(
//         (doc) => doc.id !== student.id
//       );
//       setAllDocuments(documentsAfterDelete);
//       setDocuments(documentsAfterDelete);

//       message.success("student deleted successfully");
//     } catch (err) {
//       console.error(err);
//       message.error("something went wrong while delting student");
//     }
//   };

//   return (
//     <>
//       <div className="py-5 mt-4">
//         <div className="container">
//           <div className="row">
//             <div className="col text-center">
//               <h1>Students</h1>
//             </div>
//             <div className="d-flex">
//               <Link to="/dashboard" className="btn btn-info">
//                 Add Student
//               </Link>
//             </div>
//           </div>
//           <Divider />

//           <div className="row">
//             <div className="col">
//               <div className="table-responsive">
//                 <table className="table table-striped align-middle">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Image</th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Contact</th>
//                       <th>Date of birth</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {documents.map((student, i) => {
//                       return (
//                         <tr key={i}>
//                           <th>{i + 1}</th>
//                           <td>
//                             {student.file ? (
//                               <Image
//                                 src={student.file}
//                                 className="rounded-circle"
//                                 style={{ width: 50 }}
//                               />
//                             ) : (
//                               <Avatar size={50} icon={<UserOutlined />} />
//                             )}
//                           </td>
//                           <td>
//                             <Link to={`/details/${student.id}`}>
//                               {student.name}
//                             </Link>
//                           </td>
//                           <td>{student.email}</td>
//                           <td>{student.contact}</td>
//                           <td>
//                             {student.date
//                               ? dayjs(student.date).format("dddd, DD/MM/YYYY")
//                               : ""}
//                           </td>
//                           <td>
//                             <Space>
//                               <Tooltip title="Delete" color="red">
//                                 <Button
//                                   danger
//                                   icon={<DeleteOutlined />}
//                                   onClick={() => {
//                                     handleDelete(student);
//                                   }}
//                                 />
//                               </Tooltip>
//                               <Tooltip title="Edit">
//                                 <Button
//                                   type="primary"
//                                   icon={<EditOutlined />}
//                                   onClick={() => {
//                                     navigate(
//                                       `/dashboard/students/${student.id}`
//                                     );
//                                   }}
//                                 />
//                               </Tooltip>
//                             </Space>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState } from "react";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useFetchStudents } from "../../../contexts/FetchStudents";
import { firestore } from "../../../config/firebase";
import { useFetchCourses } from "../../../contexts/FetchCourses";
import { Link, useNavigate } from "react-router-dom";
// import { BsFillPencilFill } from "react-icons/bs";
// import { AiTwotoneDelete } from "react-icons/ai";

const initialState = {
  studentId: "",
  studentName: "",
  studentEmail: "",
  courseName: "",
  studentNumber: "",
  studentaddress: "",
};

export default function Students() {
  const [state, setState] = useState(initialState);
  const [getSearch, setGetSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { getStudents, setGetstudents } = useFetchStudents();
  const { getCourse } = useFetchCourses();

  let searchedStudents = [];
  if (getSearch === "") {
    searchedStudents = getStudents;
  } else {
    searchedStudents = getStudents.filter((student) =>
      student.studentEmail.toLowerCase().includes(getSearch.toLowerCase())
    );
  }
  const sortedStudents = [...searchedStudents].sort(
    (a, b) => a.studentId - b.studentId
  );

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let {
      studentId,
      studentName,
      studentNumber,
      courseName,
      studentEmail,
      studentaddress,
    } = state;

    const data = {
      studentId,
      studentName,
      studentNumber,
      courseName,
      courseId: "",
      studentEmail,
      studentaddress,
      status: "active",
      id: Math.random().toString(36).slice(2),
      dateCreated: serverTimestamp(),
      createdBy: {
        fullName: user.fullName,
        email: user.email,
        id: user.uid,
      },
    };
    // Find the user object with the selected username
    const selectedCourse = getCourse.find(
      (course) => course.courseName === courseName
    );

    data.courseId = selectedCourse.id;
    try {
      await setDoc(doc(firestore, "students", data.id), data);
      message.success("New Students Added Successfully");
      setState(initialState);
      getStudents.push(data);
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong on Adding New Students");
    }
  };

  // ****Start****//

  const handleUpdate = async (student) => {
    setState(student);
    setIsProcessing(true);
  };

  const afterUpdate = async (e) => {
    const updateData = {
      ...state,
    };

    // Find the user object with the selected username
    const selectedCourse = getCourse.find(
      (course) => course.courseName === updateData.courseName
    );

    updateData.courseId = selectedCourse.id;

    const updateCourse = getStudents.map((oldStudents) => {
      if (oldStudents.id === updateData.id) return updateData;
      return oldStudents;
    });
    setGetstudents(updateCourse);
    try {
      await updateDoc(doc(firestore, "students", updateData.id), updateData);

      message.success("Students Updated Successfully");
      setState(initialState);
      setIsProcessing(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong While Updating Students");
    }
  };
  // *******End*******//

  const handleDelete = async (student) => {
    try {
      await deleteDoc(doc(firestore, "students", student.id));

      let StudentsAfterDelete = getStudents.filter(
        (doc) => doc.id !== student.id
      );
      setGetstudents(StudentsAfterDelete);
      message.success("Student Deleted Successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong While Deleting Student");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row">
              <h2>Students</h2>
            </div>
            <div className="row bg-light rounded-3">
              <div className="col">
                <div className="row">
                  <div className="col-12 col-md-4 py-2 d-flex align-items-center">
                    {" "}
                    <h5 className="mb-0">Student Table</h5>{" "}
                  </div>
                  <div className="col-12 col-md-4 py-2">
                    {" "}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Any By E-mail..."
                      onChange={(e) => {
                        setGetSearch(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col py-2 text-end">
                    {" "}
                    <button
                      className="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      style={{ background: "#fbdfee" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <hr />
                <div className="row mx-0 mb-2">
                  <div className="col bg-white rounded-3">
                    <div className="table-responsive rounded">
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr
                            className=""
                            style={{ background: "#c1e6c3", color: "#005a16" }}
                          >
                            <th>Sr.No</th>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Student E-mail</th>
                            <th>Course Enroll</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedStudents.map((student, i) => {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{student.studentId}</td>
                                <td>{student.studentName}</td>
                                <td>{student.studentEmail}</td>
                                <td>{student.courseName}</td>
                                <td className="text-center">
                                  <Space>
                                    <Tooltip title="Delete" color="red">
                                      <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                          handleDelete(student);
                                        }}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                          navigate(
                                            `/dashboard/students/${student.id}`
                                          );
                                        }}
                                      />
                                    </Tooltip>
                                  </Space>
                                  {/* <button
                                    className="btn btn-info p-1 py-0 rounded-2 me-0 me-lg-1"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() => {
                                      handleUpdate(student);
                                    }}
                                  >
                                    {" "}
                                    <span className="text-white my-1 d-flex align-items-center">
                                      <BsFillPencilFill size={16} />
                                    </span>{" "}
                                  </button>
                                  <button
                                    className="btn btn-danger p-1 py-0 rounded-2"
                                    onClick={() => {
                                      handleDelete(student);
                                    }}
                                  >
                                    {" "}
                                    <span className="text-white my-1 d-flex align-items-center">
                                      <AiTwotoneDelete size={16} />
                                    </span>{" "}
                                  </button> */}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* model to add new students */}

      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title fs-5" id="exampleModalLabel">
                Add New Student
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row mb-2">
                  <div className="col-4">
                    {/* <label htmlFor="">Student ID:</label> */}
                    <input
                      type="number"
                      name="studentId"
                      placeholder="Student ID"
                      className="form-control"
                      value={state.studentId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    {/* <label htmlFor="">Student Name:</label> */}
                    <input
                      type="text"
                      name="studentName"
                      placeholder="Student Name"
                      className="form-control"
                      value={state.studentName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col">
                    {/* <label htmlFor="">Student E-mail:</label>/ */}
                    <input
                      type="email"
                      name="studentEmail"
                      placeholder="Student E-mail"
                      value={state.studentEmail}
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col">
                    {/* <label htmlFor="">Student Cell:</label> */}
                    <input
                      type="number"
                      name="studentNumber"
                      placeholder="Student Cell#"
                      value={state.studentNumber}
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col">
                    <select
                      className="form-control"
                      name="courseName"
                      value={state.courseName}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {getCourse.map((course, i) => {
                        return <option key={i}>{course.courseName}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {/* <label htmlFor="">Student Address:</label> */}
                    <textarea
                      name="studentaddress"
                      className="form-control"
                      id=""
                      placeholder="Student Address"
                      value={state.studentaddress}
                      cols="30"
                      rows="3"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {isProcessing ? (
                  <button
                    className="btn"
                    type="button"
                    style={{ background: "#a2d2ff" }}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={afterUpdate}
                  >
                    Update Student
                  </button>
                ) : (
                  <button
                    className="btn"
                    type="button"
                    style={{ background: "#a2d2ff" }}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleSubmit}
                  >
                    Add Student
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
