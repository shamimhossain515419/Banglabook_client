import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Component/Authprovider/Authprovider";
import CreatePost from "../Post/CreatePost";
import Post from "../Post/Post";
import NotFound from "../../Component/PostNotFoun/NotFound";
import PostApi from "../../Component/Api/PostApi";
import { TbWorld } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa";


const OtherAbout = () => {
     const [userinfo, setUserinfo] = useState({})
     const [data, refetch, isLoading] = PostApi();
     const AllPost = data?.data;
     const MyPost = AllPost?.filter(item => item.email == userinfo?.email);
     let PostData = MyPost?.sort((a, b) => new Date(b.date) - new Date(a.date));

     const params = useParams();
     console.log(params);

     useEffect(() => {
          fetch(`https://banglabook-server.vercel.app/userId/${params?.id}`).then(res => res.json()).then(data => {
               setUserinfo(data)
          })

     }, [params?.id])

     return (
          <div className=" grid md:grid-cols-5 gap-5 items-start md:gap-8 ">
               <div className=" col-span-2  p-3 rounded-md">

                    <div className=" postShadwo p-3 rounded-md">
                         <h1 className=" secondColor text-center text-base md:text-xl   font-medium text-black "> {userinfo?.boi} </h1>

                    </div>



                    <div className=" postShadwo my-3  p-3 rounded-md">
                         <h1 className=" text-base textColor md:text-2xl font-medium"> Social media</h1>

                         <div >

                              {
                                   userinfo?.media?.length > 0 ? <div>

                                        {
                                             userinfo?.media?.map(item => <div className="  py-3 flex  items-center justify-start gap-5" key={item?.mediaName}
                                             >
                                                  <div
                                                       className=" flex  w-full  gap-2 p-2 border border-[#0000001f] rounded">

                                                       <div className=" w-full ">
                                                            <h1 className=" textColor text-start text-base  md:text-xl  font-medium -3"> {item?.mediaName} </h1>
                                                            <Link className="  text-sm  pt-1  text-[#000000cf]   md:text-base font-medium" target="_blank" to={item?.mediaLink}> {item?.mediaLink} </Link>
                                                       </div>

                                                  </div>
                                             </div>)
                                        }

                                   </div> : null
                              }

                         </div>

                    </div>
                    <div>
                         {
                              userinfo?.address ? <div className=" postShadwo p-3 rounded-md">

                                   <h1 className=" text-lg textColor  md:text-2xl font-medium"> Address</h1>
                                   <h1 className="  text-sm md:text-lg  secondColor  font-medium text-black "> {userinfo?.address} </h1>

                              </div> : null
                         }
                    </div>
                    <div>
                         {
                              userinfo?.collage ? <div className=" postShadwo p-3 rounded-md">

                                   <h1 className=" text-lg textColor  md:text-2xl font-medium"> Collage</h1>
                                   <div className=" flex items-center gap-2  mt-4">
                                        <FaGraduationCap className=" textColor" size={28} />
                                        <h1 className="  text-sm md:text-lg  secondColor  font-medium text-black "> {userinfo?.collage} </h1>

                                   </div>
                              </div> : null
                         }
                    </div>


               </div>

               <div className=" col-span-3">


                    {
                         PostData && PostData?.length > 0 ? (<div>
                              {
                                   PostData?.map(item => <Post key={item._id} post={item}></Post>)
                              }
                         </div>) : (<NotFound text={"Post not found please post"}></NotFound>)
                    }

               </div>

          </div>
     );
};

export default OtherAbout;
