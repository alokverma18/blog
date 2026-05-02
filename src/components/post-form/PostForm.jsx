import React, { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import appwriteService from "../../appwrite/configDB";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const imagePreviewRef = useRef();

  const submit = async (data) => {
    // Validate content separately since RTE doesn't integrate with react-hook-form validation
    if (!data.content || data.content.trim() === '<p></p>') {
      alert('Content is required. Please write something for your post.');
      return;
    }

    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        title: data.title,
        content: data.content,
        featuredImage: file ? file.$id : undefined,
        status: data.status
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          title: data.title,
          content: data.content,
          featuredImage: fileId,
          status: data.status,
          userId: userData.$id,
          userName: userData.name || userData.email,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const featureImageChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.addEventListener("load", function () {
        if (imagePreviewRef.current) {
          imagePreviewRef.current.src = this.result;
        }
      });
    }
  };


  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className={`mb-4 ${errors.title ? 'border-red-500' : ''}`}
          {...register("title", { 
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters long"
            }
          })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mb-4">{errors.title.message}</p>
        )}
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className={`mb-4 ${errors.image ? 'border-red-500' : ''}`}
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { 
            required: !post ? "Featured image is required" : false 
          })}
          onChangeHandler={featureImageChangeHandler}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mb-4">{errors.image.message}</p>
        )}
        {post && (
          <div className="w-full mb-4">
            <img
              ref={imagePreviewRef}
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class='w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg'>
                    <div class='text-center'>
                      <svg class='w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      <span class='text-gray-500 dark:text-gray-400 text-xs font-medium'>Image Error</span>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className={`mb-4 ${errors.status ? 'border-red-500' : ''}`}
          {...register("status", { 
            required: "Status is required" 
          })}
        />
        {errors.status && (
          <p className="text-red-500 text-sm mb-4">{errors.status.message}</p>
        )}
        <Button
          type="submit"
          bgColor={post ? "bg-blue-600 hover:bg-blue-700" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
