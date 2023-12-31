
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react';
import SubmitButton from '../../Component/Button/SubmitButton';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../../Component/Authprovider/Authprovider';


const CreateStoryText = () => {
     const [StoryImage, setStoryImage] = useState(null);
     const [selectedImage, setSelectedImage] = useState(null);
     const { user, commonLoader, setCommonLoader } = useContext(AuthContext)
     const navigate = useNavigate();
     const handleImageUpload = async () => {
          if (!selectedImage) {
               console.log('No image selected.');
               return;
          }
          console.log(selectedImage);
          setCommonLoader(true)

          const Imagebb_URL = `https://api.imgbb.com/1/upload?key=c7cb5be9cc288736ed86ddfa73d22e32`
          const formData = new FormData();
          formData.append('image', selectedImage);
          fetch(Imagebb_URL, {
               method: "POST",
               body: formData
          }).then(res => res.json()).then(data => {
               if (data.success) {
                    console.log(data);
                    console.log(data.data.display_url);
                    const image = data?.data?.display_url;

                    const date = new Date();
                    const newData = { storyImage: image, date, img: user?.photoURL, name: user?.displayName, email: user?.email }

                    fetch('https://banglabook-server.vercel.app/story', {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify(newData),
                    }).then((res) => res.json()).then(data => {

                         if (data.insertedId) {
                              setCommonLoader(false)
                              toast('Your Story success.')
                              navigate('/')
                         }
                    })

               }
          })

     };

     const handleFileChange = (event) => {
          setSelectedImage(event.target.files[0]);
          console.log(event.target.files[0]);
          setStoryImage(URL.createObjectURL(event.target.files[0]));
     };

     return (
          <div className=' flex justify-center items-center  h-[80vh] w-full'>

               <div>
                    <div className=' bg-[#2453de6a] h-96 w-full md:w-96 flex justify-center rounded-md items-center ' >
                         <div>
                              {
                                   StoryImage ? <> <img className=' h-96  w-full' src={StoryImage} alt="" /> </> : <label htmlFor="file-upload" >
                                        <div className=' p-4 rounded-full border-2 border-blue-500 cursor-pointer md:p-7'>
                                             <AiOutlineCloudUpload className='  text-blue-600' size={40}></AiOutlineCloudUpload>
                                        </div>
                                        <input accept="image/*" onChange={handleFileChange} type="file" name="" id="file-upload" className=' hidden' />
                                   </label>
                              }

                         </div>
                    </div>
                    <div className=' mt-10 flex-wrap flex gap-2 items-center    justify-center md:justify-between '>
                         <Link className=" text-xl  font-medium hover:bg-[#f43d3d] bg-[#e0e4e7] px-14 py-1 rounded-lg  hover:text-white text-blue-500" to={'/'}>
                              Discard
                         </Link>
                         <div className=' ' onClick={handleImageUpload}>
                              <SubmitButton commonLoader={commonLoader} condition={true} text='Share to Story'></SubmitButton>
                         </div>
                    </div>


                    <Toaster />
               </div>
          </div>
     );
};

export default CreateStoryText;