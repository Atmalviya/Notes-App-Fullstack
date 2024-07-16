import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/Cards/EmptyCard";
import addNoteImg from '../../assets/undraw_add_notes_re_ln36.svg'
import noDataImg from '../../assets/undraw_no_data_re_kwbl.svg'


const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "", type: "add" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };
  //* Get User Info API call
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //* Get All Notes API call
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/note");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred", error);
    }
  };

  // Delete Note
  const deleteNote = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.delete("/note/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note deleted successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showToastMessage(error.response.data.message, "error");
      }
    }
  };

  // Search Notes
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/note/search-notes", {
        params: {
          query,
        },
      });
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
        setIsSearch(true);
      }
    } catch (error) {
      console.log("An unexpected error occurred", error);
    }
  };

  // update isPinned status
  const handlePinNote = async (noteId, isPinned) => {
    try {
      const response = await axiosInstance.put("/note/pin-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note pinned status updated successfully", "update");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred", error);
    }
  };

  const handleClearSearch = () => {
    getAllNotes();
    setIsSearch(false);
  };
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
      <div className="container mx-auto">
        {allNotes.length > 0 ? (<div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.date}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => {
                deleteNote(item);
              }}
              onPinNote={() => {handlePinNote(item._id)}}
            />
          ))}
        </div>) : 
        <EmptyCard imgSrc={isSearch ? noDataImg : addNoteImg} message={isSearch ? "Oops! No notes found" : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, or tasks. Let's get started` }/>
        }
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
