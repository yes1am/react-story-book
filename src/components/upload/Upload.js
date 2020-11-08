import React, { Component } from 'react';
import classNames from 'classnames';
import ajax from './ajax';
const noop = () => { };
const filesAcceptFilter = (files, accept) => files.filter((file) => {
    const { type, name } = file;
    const extension = name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : '';
    const baseType = type.replace(/\/.*$/, '');
    return accept.split(',')
        .map((str) => str.trim())
        .filter(Boolean)
        .some((acceptedType) => {
        if (/^\..+$/.test(acceptedType)) {
            return extension === acceptedType;
        }
        if (/\/\*$/.test(acceptedType)) {
            return baseType === acceptedType.replace(/\/\*$/, '');
        }
        if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
            return type === acceptedType;
        }
        return false;
    });
});
class Upload extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.reqs = {};
        this.fileList = [];
        this.tempIndex = 1;
        this.state = {
            dragover: false,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick() {
        const { disabled } = this.props;
        if (!disabled) {
            if (this.inputRef && this.inputRef.current) {
                this.inputRef.current.click();
            }
        }
    }
    uploadFiles(files) {
        const { multiple, limit, onExceededLimit, maxSize, onExceededSize, autoUpload, onFileChange, } = this.props;
        let isFilesOverCount = false; // 是否超过数量
        if (!multiple) {
            if (files.length > 1) {
                isFilesOverCount = true;
            }
            files = files.slice(0, 1);
            this.fileList = [];
        }
        else if (limit && files.length > limit) {
            isFilesOverCount = true;
            files = files.slice(0, limit);
        }
        if (isFilesOverCount) {
            if (onExceededLimit && typeof onExceededLimit === 'function') {
                if (onExceededLimit(files.length) === false) {
                    return;
                }
            }
        }
        if (!files.length) {
            return;
        }
        files.forEach((file) => {
            // check maxSize
            if (maxSize) {
                if (file.size > maxSize * 1024) {
                    onExceededSize(file, this.fileList);
                    return false;
                }
            }
            this.handleBeforeStart(file);
            this.forceUpdate(); // 强制更新 fileList
            if (autoUpload) {
                this.upload(file);
            }
        });
        onFileChange && onFileChange(this.fileList);
    }
    upload(file) {
        const { beforeUpload, onCancel } = this.props;
        if (!beforeUpload || beforeUpload === noop) {
            return this.post(file);
        }
        const before = beforeUpload(file);
        if (before && before.then) {
            before.then((processedFile) => {
                const fileType = Object.prototype.toString.call(processedFile);
                if (fileType === '[object File]' || fileType === '[object Blob]') {
                    if (fileType === '[object Blob]') {
                        processedFile = new File([processedFile], file.name, {
                            type: file.type,
                        });
                    }
                    Object.entries(file).forEach((item) => {
                        const [key, value] = item;
                        processedFile[key] = value;
                    });
                    this.post(processedFile);
                }
                else {
                    this.post(file);
                }
            }, () => {
                onCancel && onCancel(file);
            });
        }
        else if (before !== false) {
            this.post(file);
        }
        else {
            onCancel && onCancel(file);
        }
    }
    post(file) {
        const { withCredentials, action, headers, data, name, httpRequest, } = this.props;
        if (!action) {
            console.warn('[ReactUI warn][Upload]: action required when upload');
            return;
        }
        const { uid } = file;
        const options = {
            headers,
            withCredentials,
            file,
            data,
            filename: name,
            action,
            onProgress: (e) => {
                this.handleProgress(e, file);
            },
            onSuccess: (res) => {
                this.handleSuccess(res, file);
                delete this.reqs[uid];
            },
            onError: (err) => {
                this.handleError(err, file);
                delete this.reqs[uid];
            },
            onAbort: (err) => {
                // TODO: ui 未实现
                console.log('abort');
            },
        };
        const req = httpRequest(options);
        this.reqs[uid] = req;
        if (req && req.then) {
            req.then(options.onSuccess, options.onError);
        }
    }
    getFile(file) {
        const uid = file.uid ? file.uid : file;
        return this.fileList.find((item) => uid === item.uid);
    }
    handleSuccess(res, file) {
        const { onSuccess } = this.props;
        const tmpFile = this.getFile(file);
        if (tmpFile) {
            tmpFile.status = 'success';
            tmpFile.response = res;
            onSuccess(res, tmpFile, this.fileList);
        }
    }
    handleError(err, file) {
        const { onError } = this.props;
        const tmpFile = this.getFile(file);
        const { fileList } = this;
        if (tmpFile) {
            tmpFile.status = 'fail';
            onError(err, tmpFile, fileList);
        }
    }
    handleProgress(e, file) {
        const { onProgress } = this.props;
        const tmpFile = this.getFile(file);
        if (tmpFile) {
            tmpFile.status = 'uploading';
            tmpFile.percentage = e.percent || 0;
            onProgress(e, tmpFile, this.fileList);
        }
    }
    /** 往 fileList 放数据 */
    handleBeforeStart(file) {
        // eslint-disable-next-line no-plusplus
        file.uid = Date.now() + this.tempIndex++;
        const tmpFile = {
            uid: file.uid,
            status: 'ready',
            name: file.name,
            size: file.size,
            percentage: 0,
            raw: file,
        };
        try {
            tmpFile.url = URL.createObjectURL(file);
        }
        catch (e) {
            console.warn(`[ReactUI warn][Upload]: error in creation url of ${file.name}: ${e}`);
        }
        this.fileList.push(tmpFile);
    }
    handlePaste(e) {
        const { disabled, paste } = this.props;
        if (!disabled && paste) {
            this.uploadFiles([...Array.from(e.clipboardData.files)]);
        }
    }
    getDirectoryEntryAsPromise(directoryEntry) {
        return new Promise((resolve) => {
            const directoryReader = directoryEntry.createReader();
            directoryReader.readEntries((entries) => {
                resolve(Promise.all(entries.map((entry) => {
                    if (entry.isDirectory) {
                        return this.getDirectoryEntryAsPromise(entry);
                    }
                    return this.getFileEntryAsPromise(entry);
                })).then((res) => res.reduce((files, file) => files.concat(file), [])));
            });
        });
    }
    getFileEntryAsPromise(entry) {
        return new Promise((resolve, reject) => {
            entry.file((file) => {
                // set relativePath for file
                // because webkitRelativePath of file is empty when drag
                file.relativePath = entry.fullPath;
                resolve(file);
            }, (e) => {
                reject(e);
            });
        });
    }
    // 获取拖拽的文件
    getDropFiles(e) {
        const { webkitdirectory } = this.props;
        if (webkitdirectory && e.dataTransfer.items) {
            // 上传目录
            const fileItems = Array.prototype.slice.call(e.dataTransfer.items);
            const entries = fileItems
                .map((item) => item.webkitGetAsEntry())
                .filter((item) => item.isDirectory);
            const promises = entries.map((item) => this.getDirectoryEntryAsPromise(item));
            // filter directories
            return Promise.all(promises)
                .then((res) => res.reduce((files, n) => files.concat(n), []));
        }
        return [...Array.from(e.dataTransfer.files)];
    }
    async handleDrop(e) {
        const { disabled, accept, onExceededAccept } = this.props;
        const { dragover } = this.state;
        e.preventDefault();
        if (!disabled) {
            if (dragover) {
                this.setState({
                    dragover: false,
                });
            }
            const allFiles = await this.getDropFiles(e);
            let files = allFiles;
            if (accept) {
                files = filesAcceptFilter(allFiles, accept);
                // 如果有文件不符合 accept 要求，那么
                const exceededFiles = allFiles.filter((file) => files.indexOf(file) === -1);
                if (!!exceededFiles.length && onExceededAccept(exceededFiles) === false) {
                    return;
                }
            }
            this.uploadFiles(files);
        }
    }
    handleDragOver(e) {
        const { disabled } = this.props;
        const { dragover } = this.state;
        e.preventDefault();
        if (!disabled && !dragover) {
            this.setState({
                dragover: true,
            });
        }
    }
    handleDragLeave() {
        const { dragover } = this.state;
        if (dragover) {
            this.setState({
                dragover: false,
            });
        }
    }
    /**
     * 取消上传
     * @param rawFile 文件
     */
    abort(rawFile) {
        const { reqs } = this;
        if (rawFile) {
            const file = this.getFile(rawFile);
            if (file && reqs[file.uid]) {
                reqs[file.uid].abort();
                delete reqs[file.uid];
            }
        }
        else {
            Object.keys(reqs).forEach((uid) => {
                if (reqs[uid]) {
                    reqs[uid].abort();
                }
                delete reqs[uid];
            });
        }
    }
    remove(rawFile) {
        const { onFileChange } = this.props;
        if (rawFile) {
            const file = this.getFile(rawFile);
            this.abort(file);
            const index = this.fileList.indexOf(file);
            if (index >= 0) {
                this.fileList.splice(index, 1);
            }
        }
        else {
            this.abort();
            this.clearFiles();
        }
        this.forceUpdate();
        onFileChange && onFileChange(this.fileList);
    }
    /**
     * 清除所有文件
     */
    clearFiles() {
        this.fileList = [];
        this.forceUpdate();
    }
    submit(rawFile) {
        if (rawFile) {
            const file = this.getFile(rawFile);
            if (file && (file.status === 'ready' || file.status === 'fail')) {
                this.upload(file.raw);
            }
        }
        else {
            this.fileList
                .filter((file) => file.status === 'ready' || file.status === 'fail')
                .forEach((file) => {
                this.upload(file.raw);
            });
        }
    }
    handleChange(e) {
        const { webkitdirectory } = this.props;
        const { files } = e.target;
        if (!files) {
            return;
        }
        const tmpFiles = [...Array.from(files)];
        if (webkitdirectory) {
            // 如果是上传目录，那么设置路径
            tmpFiles.forEach((file) => {
                // set relativePath for file, because webkitRelativePath of file is empty when drag
                if (file.webkitRelativePath) {
                    file.relativePath = file.webkitRelativePath;
                }
            });
        }
        this.uploadFiles(tmpFiles);
        if (this.inputRef && this.inputRef.current) {
            this.inputRef.current.value = null;
        }
    }
    render() {
        const { drag, disabled, name, webkitdirectory, accept, multiple, children, tip, className, renderList, } = this.props;
        const { dragover } = this.state;
        const uploadClass = classNames('react-upload', className);
        const wrapClass = classNames({
            'react-upload-wrapper': true,
            'react-upload-dragger': drag,
            'is-dragover': drag && dragover,
            disabled,
        });
        // 通过解构 props，规避 ts 的类型错误问题
        const webKitProps = {};
        if (webkitdirectory) {
            webKitProps.webkitdirectory = 'true';
        }
        return (<div className={uploadClass}>
        <div className={wrapClass} onClick={this.handleClick} onPaste={this.handlePaste} onDrop={this.handleDrop} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave}>
          <input className="react-upload__input" ref={this.inputRef} type="file" name={name} accept={accept} multiple={multiple} {...webKitProps} onChange={this.handleChange}/>
          {children}
        </div>
        {!!tip && tip}
        {!!renderList && renderList(this.fileList)}
      </div>);
    }
}
Upload.defaultProps = {
    name: 'file',
    headers: {},
    autoUpload: true,
    beforeUpload: noop,
    onProgress: noop,
    onSuccess: noop,
    onError: noop,
    onExceededSize: noop,
    onExceededLimit: noop,
    onExceededAccept: noop,
    httpRequest: ajax,
};
Upload.propTypes = {};
export default Upload;