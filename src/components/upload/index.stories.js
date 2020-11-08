import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import Upload from '.';
import axios from 'axios';

export default {
  title: '组件/Upload',
  component: null,
  argTypes: {
  },
}


export const One = () => (
  <div style={{margin: '20px 0'}}>
      <>
        <div style={{margin: '20px 0'}}>
          <Upload
            onSuccess={() => console.log('success')}
            onError={() => console.log('error')}
            action="/postpic"
          >
            <div>Upload</div>
          </Upload>
        </div>
        <div style={{margin: '20px 0'}}>
          <Upload onSuccess={() => console.log('success')} onError={() => console.log('error')} action="/postpic">
            <div>Upload</div>
          </Upload>
        </div>
        <div style={{margin: '20px 0'}}>
          <Upload action="/postpic">
            <div>Upload</div>
          </Upload>
        </div>
        <div style={{margin: '20px 0'}}>
          <Upload action="/postpic">
            <div>Upload</div>
          </Upload>
        </div>
        <div style={{margin: '20px 0'}}>
          <Upload action="/postpic">
            <div>Upload</div>
          </Upload>
        </div>
        <div style={{margin: '20px 0'}}>
          <Upload action="/postpic">
            <div>Upload</div>
          </Upload>
        </div>
      </>
    </div>
)

One.storyName = 'Basic';

export const Two = () => (
  <div>
    <Upload multiple action="/postpic">
      <div>Upload</div>
    </Upload>
  </div>
)

Two.storyName = 'Multiple'

export const Three = () => {
  const [status, setStatus] = useState(1);
  const [percentage, setPercentage] = useState(0);
  const [hover, setHover] = useState(false);
  let statusClass = ''
  if (status === 2) {
    statusClass = 'uploading';
  } else if (status === 3) {
    statusClass = 'uploaded';
  }
  const uploadFilesExample = () => {
    setTimeout(() => {
      setStatus(2)
      const t = setInterval(() => {
        // setPercentage(percentage + 20)
        setPercentage(prevPercentage =>  {
          const newPercentage = prevPercentage + 20;
          if (newPercentage >= 100) {
            setStatus(3)
            clearInterval(t);
          }
          return newPercentage
        })
      }, 500);
    }, 200);
  };
  return (
    <>
      <div>
        <Upload
          className={classNames("react-upload__image", statusClass)}
          drag
          disabled={status !== 1}
          httpRequest={uploadFilesExample}
          action="/"
        >
          { status === 1 && <div>add</div> }
          { status !== 1 && (
            <div className="image-bg">
              {
                status === 2 && (
                  <>
                    <div className="mask"></div>
                    percentage: {percentage}
                  </>
                )
              }
              {
                status === 3 && (
                  <>
                    <div
                      className="mask-preview"
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    />
                    <div className="bottom-bar" onClick={() => setStatus(1)} >
                      <div className="delete-icon" type="delete">
                        delete
                      </div>
                    </div>
                  </>
                )
              }
            </div>
          )}
        </Upload>
      </div>
      <div>
        <Upload
          className="react-upload__image"
          drag
          disabled
          httpRequest={uploadFilesExample}
          action="/"
        >
          <div>
            add
          </div>
        </Upload>
      </div>
    </>
  )
}

Three.storyName = '图片上传'

export const Four = () => {
  const uploadFiles = (option) => {
    const formData = new FormData();
    if (option.data) {
      Object.keys(option.data).forEach(key => {
        formData.append(key, option.data[key]);
      });
    }
    formData.append(option.filename, option.file, option.file.name);
    const config = {
      withCredentials: option.withCredentials,
      onUploadProgress(e) {
        if (e.total > 0) {
          e.percent = e.loaded / e.total * 100;
        }
        option.onProgress(e);
      }
    };
    return axios.post('/postpic', formData, config);
  }
  return (
    <div>
      <Upload httpRequest={uploadFiles} action="/">
        <div>Upload</div>
      </Upload>
    </div>
  )
}

Four.storyName = 'Custom Axios HttpRequest'

export const Five = () => {
  const [status2, setStatus2] = useState(1);
  const uploadFilesExample2 = () => {
    setTimeout(() => {
      setStatus2(2)
      setTimeout(() => {
        setStatus2(1)
        const type = 'success';
        console.log('success');
        // TODO:
        // this.$toast[type]({
        //   message: type,
        //   duration: 3000
        // });
      }, 2000);
    }, 200);
  }
  return (
    <div>
      <Upload
        drag
        httpRequest={uploadFilesExample2}
        action="/"
        className={classNames("draggable", { loading: status2 !== 1})}
      >
        { status2 === 1 ? (
          <>
            <div>upload</div>
            <div className="react-upload__text">
              Drop or Select excel files here to upload
            </div>
            <div className="react-upload__desc">
              File: jpg, png;  Numbers: 10.
            </div>
            <div type="primary" className="react-upload__button">
              Select File
            </div>
          </>
        ) : (
          <div className="uploading-content">
            <div>loading</div>
          </div>
          )
        }
      </Upload>
    </div>
  )
}

Five.storyName = 'Drag'

const Six = () => {
  const uploadRef = useRef(null)
  const onClick = (action, file) => {
    if(uploadRef.current && uploadRef.current[action]) {
      uploadRef.current[action](file);
    }
  }
  return (
    <div>
      <Upload
        ref={uploadRef}
        drag
        multiple
        accept="image/*"
        maxSize={500}
        autoUpload={false}
        action="/postpic"
        onSuccess={(res, tmpFile, fileList) => {
          console.log('上传成功');
          console.log({
            res,
            tmpFile,
            fileList
          })
        }}
        onError = {(err, tmpFile, fileList) => {
          console.log('上传失败');
          console.log({
            res,
            tmpFile,
            fileList
          })
        }}
        tip={<div className="react-upload__tip">images with a size less than 500 kb</div>}
        renderList={(fileList) => {
          return (
            <ul className="react-upload-list">
              {fileList.map((file, index) => {
                return (
                  <li className={classNames("react-upload-list-item", file.status)} key={file.uid}>
                    <div onClick={() => onClick('remove', file)}>
                      <div>close</div>
                    </div>
                    <div className="react-upload-list-item--img">
                      <img src={file.url} alt="" />
                    </div>
                    <div className="react-upload-list-item--name">
                      {file.name}
                    </div>
                    <div className="react-upload-list-item--actions">
                      <div onClick={() => onClick('submit', file)}>
                        Upload
                      </div>
                      <div onClick={() => onClick('abort', file)}>
                        Abort
                      </div>
                    </div>
                  </li>
                )
              })}
          </ul>
          )
        }}
      >
        <div>upload</div>
        <div className="react-upload__text">
          Drop or Select excel files here to upload
        </div>
        <div type="primary" className="react-upload__button">
          Select File
        </div>
      </Upload>
    </div>
  )
}

Six.storyName = '自定义展示列表'