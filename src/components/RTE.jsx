import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';
import conf from '../config/config.js';
import { useTheme } from '../context/ThemeContext.jsx';


export default function RTE({name, control, label, defaultValue =""}) {
  const { isDark } = useTheme();
  
  return (
    <div className='w-full'> 
    {label && <label className='inline-block mb-1 pl-1 text-sm font-medium text-gray-700 dark:text-gray-200'>{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange}}) => (
        <Editor
        apiKey={conf.tinyMCEKey}
        initialValue={defaultValue}
        init={{
            initialValue: defaultValue,
            height: 500,
            menubar: true,
            skin: isDark ? 'oxide-dark' : 'oxide',
            content_css: isDark ? 'dark' : 'default',
            plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            toolbar:
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: isDark 
                ? "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; color: #e5e7eb; background-color: #1f2937; }"
                : "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }"
        }}
        onEditorChange={onChange}
        />
    )}
    />

     </div>
  )
}
