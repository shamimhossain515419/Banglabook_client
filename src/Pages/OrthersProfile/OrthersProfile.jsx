
import { FiMoreHorizontal } from "react-icons/fi";
import { Link, NavLink, Outlet, useParams, } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Component/AsioxSecures/useAxiosSecure";
import { useContext, useState } from "react";
import { AuthContext } from "../../Component/Authprovider/Authprovider";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";


const OtherProfile = () => {
     const [value, setValue] = useState("");
     const [copied, setCopied] = useState(false);
     const [axiosSecure] = useAxiosSecure();
     const [active, setActive] = useState("")
     const params = useParams();
     const [matchEmail, setMatchEmail] = useState("")
     const [openCopy, setOpenCopy] = useState(false)
     const { user, userinfo } = useContext(AuthContext)
     console.log(params);
     const { data, refetch, isLoading } = useQuery({
          queryKey: ['user'],
          queryFn: () => axiosSecure(`/userId/${params?.id}`)
     })

     const userData = data?.data;

     const handleClick = (email) => {
          const fromData = { me: user?.email, friend: email }
          console.log(fromData);
          axiosSecure.post('/follower', fromData).then(result => {
               console.log(result);
               if (result) {
                    setActive("Send Request")
                    toast.success(result?.data?.massage)
               }
          }).catch(e => {
               console.log(e);
               toast.error(e.massage)
          })

     }
     const handleCopy = () => {
          setCopied(true);
     };

     useEffect(() => {
          setValue(`https://banglabook-92cb9.web.app/otherProfile/profile/${userData?._id}`);
          const following = userinfo?.following;
    
          const findEmail = following?.find(item => item == userData?.email);
          setMatchEmail(findEmail);
         
     }, [userData, userinfo])

     return (
          <div className=" w-full md:mr-10 mr-1 md:px-20 md:-mt-10 ">
               <div>
                    <div className="">

                         <div className=" md:mt-3 -mt-8  relative ">
                              <div className="  relative ">
                                   {
                                        userData?.Cover ? <img className=" relative  rounded-md w-full object-cover h-[400px] " src={userData?.Cover} alt="" /> : <img className=" relative  rounded-md w-full h-[40vh] " src="https://img.freepik.com/free-vector/3d-social-media-background_52683-29718.jpg?w=1380&t=st=1689308805~exp=1689309405~hmac=b1beec3c098f47820dde6ca055cc98ee70e085269d7bba91c37dbd7029b5bca9" alt="" />
                                   }
                              </div>


                              <div className=" px-8 md:flex justify-between ">
                                   <div className=" text-center md:flex gap-4  ">
                                        <div className=" relative ">
                                             <img className='    mx-auto border-2 border-white -mt-8 relative h-32 w-32 rounded-full object-cover' src={userData?.image} alt="" />
                                        </div>

                                        <div className=" mt-2">
                                             <h1 className='relative uppercase font-semibold text-black  text-2xl'>{userData?.name}</h1>
                                             <p className=" text-lg">  <NavLink to={`/otherProfile/profile/${params?.id}/followers/${params?.id}`}> {userData?.followers?.length ? userData?.followers?.length : 0} followers</NavLink> •  <NavLink to={`/otherProfile/profile/${params?.id}/followers/${params?.id}`}>{userData?.following?.length ? userData?.following?.length : 0} following</NavLink> </p>
                                        </div>
                                   </div>
                                   <div className=" mt-7 md:mt-0  sm:flex  items-center  gap-1 text-center   ">
                                         {
                                              matchEmail ? <div className="commonButton   my-3 text-base  md:text-xl ">Friend</div> : <div onClick={() => handleClick(userData?.email)} className="commonButton   my-3 text-base  md:text-xl cursor-pointer">{active ? active : "Add Friend"}</div>
                                         }
                                        
                                        <Link to={'/messenger'} className=" commonButton text-base  md:text-xl my-3   cursor-pointer"> Massage</Link>

                                   </div>
                              </div>
                         </div>

                         <div>

                         </div>
                    </div>
                    <hr className=" my-2 border" />

                    <div className=" flex items-center justify-between">
                         <div className=" flex  items-center  flex-wrap gap-4 md:gap-6">
                              <NavLink to={`/otherProfile/profile/${params?.id}`} className={({ isActive }) => isActive ? "text-lg font-medium text-blue-400" : "text-lg font-medium"}>Post</NavLink>
                              <NavLink to={`/otherProfile/profile/${params?.id}/about/${params?.id}`} className={"text-lg font-medium"}>About</NavLink>
                              <NavLink to={`/otherProfile/profile/${params?.id}/photo/${params?.id}`} className={({ isActive }) => isActive ? "text-lg font-medium text-blue-400" : "text-lg font-medium"}>Photo</NavLink>
                              <NavLink to={`/otherProfile/profile/${params?.id}/video/${params?.id}`} className={({ isActive }) => isActive ? "text-lg font-medium text-blue-400" : "text-lg font-medium"}>Video</NavLink>
                              <NavLink to={`/otherProfile/profile/${params?.id}/followers/${params?.id}`} className={({ isActive }) => isActive ? "text-lg font-medium text-blue-400" : "text-lg font-medium"}>Followers</NavLink>
                         </div>
                         <div className="   relative cursor-pointer">
                              <div onClick={() => setOpenCopy(true)} className=" only:bg-[#d2cdcd] p-2 md:p-3 rounded-full ">
                                   <FiMoreHorizontal stitchTiles={28}></FiMoreHorizontal>
                              </div>
                              {
                                   openCopy ? <div className=" flex  items-center gap-2 right-5  justify-between  absolute top-1 boxshadow bg-white p-2 px-4 rounded-md">
                                        {
                                             copied ? <p className=" text-red-500 text-base  md:text-lg font-medium">   Copied</p> : <CopyToClipboard text={value} onCopy={handleCopy}>

                                                  <div className=" flex items-center w-full gap-3 ">

                                                       <FaRegCopy className=" cursor-pointer textColor" size={25} />
                                                  </div>
                                             </CopyToClipboard>
                                        }


                                        <div onClick={() => setOpenCopy(false)} >
                                             <IoMdCloseCircleOutline size={24} />
                                        </div>
                                   </div> : null
                              }



                         </div>
                    </div>
                    <div className="p-1 md:p-3">
                         <Outlet></Outlet>
                    </div>




               </div>



               <div>

               </div>
          </div>
     );
};

export default OtherProfile;