import React, { useContext, useState } from "react";
import { AuthContext } from "../../Component/Authprovider/Authprovider";
import { FaGrinAlt, FaVideo } from "react-icons/fa";
import { HiOutlinePhotograph } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../Component/AsioxSecures/useAxiosSecure";
import PostApi from "../../Component/Api/PostApi";
import { FadeLoader } from "react-spinners";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../../Firebaseconfig";
import { firebaseStroageURL } from "../../utilis";
import { useRef } from "react";
import { Emoge, } from "../../utilis/index.js";
import { IoIosClose } from "react-icons/io";
const storage = getStorage(app, firebaseStroageURL);


export default function CreatePost() {
     const [data, refetch, isLoading] = PostApi();
     const [videoPerc, setVideoPerc] = useState(null);
     const [inputVideo, setInputs] = useState('');
     const [open, setOpen] = useState('');
     const { user } = useContext(AuthContext);
     const [axiosSecure] = useAxiosSecure();
     const [isPlaying, setIsPlaying] = useState(false);
     const [showModal, setShowModal] = useState(false);
     const [selectedImage, setSelectedImage] = useState(null);
     const [text, setText] = useState("");
     const [image, setImage] = useState("");
     const [imageLoading, setImageLoading] = useState(false);
     const [activity, setActivity] = useState("")
     const [selectedValue, setSelectedValue] = useState('public');
     const navigate = useNavigate();
     const handleImageChange = (e) => {
          setImageLoading(true)
          const file = e.target.files[0];
          const Imagebb_URL = `https://api.imgbb.com/1/upload?key=c7cb5be9cc288736ed86ddfa73d22e32`
          const formData = new FormData();
          formData.append('image', file);
          fetch(Imagebb_URL, {
               method: "POST",
               body: formData
          }).then(res => res.json()).then(data => {
               if (data?.data?.display_url) {
                    setImage(data?.data?.display_url);
                    setSelectedImage(URL.createObjectURL(file));
                    setImageLoading(false)
               }
          }).catch(error => {
               toast.error("File Upload Not Working")
          })
     };


     const videoRef = useRef(null);
     const handleSubmit = () => {
          const PostData = { image, video: inputVideo, PostItem: selectedValue, comment: [], name: user?.displayName, userImage: user?.photoURL, like: 0, date: new Date(), likeEmail: [], description: text, activity, email: user?.email };

          axiosSecure.post('/post', PostData).then(result => {
               console.log(result.data.insertedId)
               if (result.data.insertedId) {
                    toast.success('Post Success');
                    navigate('/');
                    refetch();
                    setImage('')
                    setShowModal(false);
               }
          }).catch(error => {
               console.log(error.massage);
          })
     }
     const handleChange = (event) => {
          setSelectedValue(event.target.value);
     };

     const handleText = (event) => {
          setText(event.target.value);

     };




     const createUniqueFileName = (getFile) => {
          const timeStamp = Date.now();
          const randomStringValue = Math.random().toString(36).substring(2, 12);

          return `${getFile.name}-${timeStamp}-${randomStringValue}`;
     };

     async function helperForUPloadingImageToFirebase(file) {
          const getFileName = createUniqueFileName(file);
          const storageReference = ref(storage, `banglabook/${getFileName}`);
          const uploadImage = uploadBytesResumable(storageReference, file);

          return new Promise((resolve, reject) => {
               uploadImage.on(
                    "state_changed",
                    (snapshot) => {
                         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                         setVideoPerc((Math.round(progress)))
                    },
                    (error) => {
                         console.log(error);
                         reject(error);
                    },
                    () => {
                         getDownloadURL(uploadImage.snapshot.ref)
                              .then((downloadUrl) => resolve(downloadUrl))
                              .catch((error) => reject(error));
                    }
               );
          });
     }

     const handleVideoUpload = async (event) => {

          const extractImageUrl = await helperForUPloadingImageToFirebase(
               event.target.files[0]
          );
          console.log(extractImageUrl, "hsmijmdf");
          if (extractImageUrl) {
               console.log(extractImageUrl);
               setInputs(extractImageUrl)
          }

     };



     console.log(inputVideo);
     console.log(videoPerc);
     return (
          <>

               <div className=" p-3 postShadwo rounded  bg-white ">
                    <h1 className=" text-2xl font-medium my-2 text-[#343131]"> Create Post</h1>
                    <div className=" px-1 md:px-3 py-1 flex gap-2 items-center ">
                         <div>
                              <img src={user?.photoURL} className="  object-container h-10 w-10 rounded-full" alt="" />
                         </div>
                         <div className=" w-full">
                              <button onClick={() => setShowModal(true)} className=" w-full bg-[#E4E6E8] text-[10px]  sm:text-base md:text-lg  rounded-3xl py-1 px-3 "> What's on your mind, {user?.displayName} ?  </button>
                         </div>

                    </div>
                    <div>
                         <hr className=" my-2" />
                    </div>
                    <div className=" flex justify-between items-center gap-4">
                         <div onClick={() => setShowModal(true)} className=" flex justify-center  cursor-pointer items-center gap-2">
                              <FaVideo size={20} className=" text-[#e53d3d]"></FaVideo>
                              <p className=" text-xl"> Live </p>
                         </div>
                         <div onClick={() => setShowModal(true)} className=" flex justify-center cursor-pointer  items-center gap-2">
                              <HiOutlinePhotograph size={20} className=" text-[#2195d0]"></HiOutlinePhotograph>
                              <p className=" text-xl"> Photo </p>
                         </div>
                         <div onClick={() => setShowModal(true)} className=" flex justify-center  cursor-pointer items-center gap-2">
                              <FaGrinAlt size={20} className=" text-[#e5c13dca]"></FaGrinAlt>
                              <p className=" text-xl"> Activity </p>
                         </div>
                    </div>


               </div>
               {showModal ? (
                    <>
                         <div
                              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                         >
                              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                   {/*content*/}
                                   <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        {/*header*/}
                                        <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                             <h1 className=" text-center mx-auto font-bold text-2xl"> Create Post</h1>
                                             <button
                                                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                  onClick={() => setShowModal(false)}
                                             >
                                                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                       ×
                                                  </span>
                                             </button>
                                        </div>
                                        {/*body*/}
                                        <div className="relative p-6 w-full md:min-w-[600px] flex-auto">
                                             <div className=" flex items-center ">
                                                  <div className=" flex justify-center cursor-pointer  items-center gap-2">
                                                       <img src={user?.photoURL} className=" h-10 w-10 rounded-full " alt="" />
                                                       <h1 className=" text-base md:text-xl">{user?.displayName}</h1>
                                                  </div>
                                                  <div>
                                                       {activity}
                                                  </div>
                                                  <div>
                                                       <select value={selectedValue} onChange={handleChange} name="post" id="post" className="block w-full p-2   rounded-md focus:outline-none focus:border-blue-500">
                                                            <option value="public" className="text-gray-700">  Public</option>
                                                            <option value="friends" className="text-gray-700">Friends</option>
                                                            <option value="custom" className="text-gray-700">Custom</option>
                                                       </select>

                                                  </div>

                                             </div>

                                             <div className=" mt-2">
                                                  <div>
                                                       <textarea onChange={handleText}
                                                            className="w-full px-4 py-2  border-none outline-none  "
                                                            rows={4}
                                                            placeholder={`What's on your mind, ${user?.displayName} ?`}
                                                       ></textarea>


                                                  </div>


                                             </div>
                                             <div>
                                                  <div className=" max-h-[400px] overflow-hidden">


                                                       {selectedImage && (
                                                            <div className=" max-h-[400px] overflow-hidden mx-auto text-center  w-full ">
                                                                 <img className=" w-full max-h-[400px] object-contain    mx-auto text-center" src={selectedImage} alt="Selected" />

                                                            </div>
                                                       )}

                                                       {
                                                            inputVideo ? <div className=" h-[300px] hw-full overflow-hidden mx-auto text-center  w-full ">
                                                                 <video className="  object-contain" controls={isPlaying} muted loop >   <source src={inputVideo} type="video/mp4"></source> </video>




                                                            </div> : null
                                                       }
                                                        <div className=" flex justify-center  items-center gap-3 mt-4">
                                                        {
                                                            imageLoading ? <FadeLoader color="#36d7b7" /> : null
                                                       }
                                                        </div>


                                                       {
                                                            videoPerc && videoPerc <= 99 ? <p className=" mb-4 text-2xl font-semibold text-center text-[#028924]">    Loading....  {videoPerc}%</p> : null
                                                       }
                                                  </div>
                                             </div>
                                             <div>

                                             </div>
                                             <div className=" mt-4 flex  items-center  justify-between">
                                                  <div>
                                                       <div className=" flex justify-center  cursor-pointer items-center gap-2">
                                                            <label htmlFor="video" className=" flex justify-center  cursor-pointer items-center gap-2 ">
                                                                 <FaVideo size={20} className=" text-[#e53d3d]"></FaVideo>
                                                                 <p className=" text-xl"> Video </p>
                                                                 <input id="video" className=' top-2 m-3 font-bold text-3xl p-2 hidden ' type="file" onChange={handleVideoUpload} accept='vide' />
                                                            </label>

                                                       </div>
                                                  </div>
                                                  <div>


                                                       <label htmlFor="file">
                                                            <div className=" flex justify-center cursor-pointer  items-center gap-2">
                                                                 <HiOutlinePhotograph size={20} className=" text-[#1e6be7]"></HiOutlinePhotograph>
                                                                 <p className=" text-xl"> Photo </p>
                                                            </div>
                                                            <input type="file" id="file" className=" hidden" onChange={handleImageChange} />
                                                       </label>
                                                  </div>
                                                  <div onClick={() => setOpen(true)} className=" flex justify-center  cursor-pointer items-center gap-2">
                                                       <FaGrinAlt size={20} className=" text-[#e5c13dca]"></FaGrinAlt>
                                                       <p className=" text-xl"> Activity </p>

                                                  </div>

                                                  {
                                                       open ? <div className="   absolute top-0  boxshadow gap-4 p-3  bg-white">
                                                            <div onClick={() => setOpen(false)} className=" cursor-pointer  text-end ">
                                                                 <IoIosClose size={29} />
                                                            </div>
                                                            <div className=" grid md:grid-cols-2  gap-4 p-3 rounded-lg ">
                                                                 {
                                                                      Emoge?.map(item => <p onClick={() => { setActivity(item?.text), setOpen(false) }} className=" cursor-pointer p-1   rounded-lg  hover:bg-[#00000067] text-2xl font-normal " key={item?.id}> {item?.text} </p>)
                                                                 }
                                                            </div>
                                                       </div> : null
                                                  }
                                             </div>

                                        </div>
                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                             <button
                                                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                  type="button"
                                                  onClick={() => setShowModal(false)}
                                             >
                                                  Close
                                             </button>
                                             <button
                                                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                  type="button"
                                                  onClick={handleSubmit}
                                             >
                                                  Post
                                             </button>
                                             <Toaster
                                                  position="top-center"
                                                  reverseOrder={true}
                                             />
                                        </div>
                                   </div>
                              </div>
                         </div>
                         <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
               ) : null}
          </>
     );
}