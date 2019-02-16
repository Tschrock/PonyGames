

/**
 * Hashing Utilities
 */

declare class Rusha {
    static createHash(): RushaHash;
}
interface RushaHash {
    update(buffer: ArrayBuffer): this;
    digest(format: 'hex'): string;
    digest(): ArrayBuffer;
}

const HEX_CHARS = '0123456789abcdef';
function buff2Hex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)].map(v => HEX_CHARS[v >> 4] + HEX_CHARS[v & 15]).join('');
}

async function simpleSHA1(buffer: ArrayBuffer): Promise<ArrayBuffer> {
    try {
        return window.crypto.subtle.digest("SHA1", buffer);
    }
    catch(e) {
        return Rusha.createHash().update(buffer).digest(); 
    }
}

/**
 * File Utilities
 */

enum Size {
    KiB = 2**10,
    MiB = 2**20,
    GiB = 2**30,
    KB = 1e3,
    MB = 1e6,
    GB = 1e9
}

const CHUNK_SIZE = 10 * Size.MiB;

async function chunkBlob(blob: Blob, onChunk: (chunk: Blob, chunkIndex: number) => void, chunkSize = CHUNK_SIZE) {
    let pointer = 0;
    while (pointer < blob.size) {
        const chunk = blob.slice(pointer, pointer + chunkSize);
        await onChunk(chunk, pointer);
        pointer += chunk.size;
    }
}

async function readFileAsync(file: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as ArrayBuffer));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Upload Utilities
 */





/*

1. Get upload ticket
2. Upload file or file parts
3. Close upload ticket

*/


class FileUploader {
    
    private root: HTMLLabelElement;
    private input: HTMLInputElement;
    private progressBar: HTMLProgressElement;
    private progressText: HTMLElement;
    private statusIcon: HTMLElement;
    private statusText: HTMLElement;

    private isUploading = false;

    constructor(replaceElement: HTMLElement) {

        // Build the UI
        this.root = document.createElement('label');
        this.root.classList.add('pg-uploader');
        this.root.addEventListener("dragover", this.OnDragOver.bind(this));
        this.root.addEventListener("dragenter", this.OnDragEnter.bind(this));
        this.root.addEventListener("drop", this.OnDrop.bind(this));

        this.input = document.createElement('input');
        this.input.addEventListener("change", this.OnChange.bind(this));
        this.root.appendChild(this.input);

        this.progressBar = document.createElement('progress');
        this.root.appendChild(this.progressBar);
        
        this.progressText = document.createElement('span');
        this.root.appendChild(this.progressText);

        this.statusIcon = document.createElement('i');
        this.root.appendChild(this.statusIcon);

        this.statusText = document.createElement('span');
        this.root.appendChild(this.statusText);

        // Setup initial state
        this.HideProgressBar();
        this.HideProgressText();
        this.ShowStatusIcon("fas", "fa-file-upload");
        this.ShowStatusText("Click or Drag to upload a file");
        
        // Inject it into the DOM
        if(replaceElement.parentNode) replaceElement.parentNode.replaceChild(this.root, replaceElement);
        else replaceElement.appendChild(this.root);

    }

    private DisableInput() {
        this.input.style.display = "none";
    }

    private EnableInput() {
        this.input.style.display = "block";
    }

    private ShowStatusIcon(...value: string[]) {
        this.statusIcon.style.display = "block";
        this.statusIcon.className = "";
        this.statusIcon.classList.add(...value);
    }

    private HideStatusIcon() {
        this.statusIcon.style.display = "none";
    }

    private ShowStatusText(value: string) {
        this.statusText.style.display = "block";
        this.statusText.innerText = value;
    }

    private HideStatusText() {
        this.statusText.style.display = "none";
    }


    private ShowProgressBar(value: number) {
        this.progressBar.style.display = "block";
        this.progressBar.value = value;
    }

    private HideProgressBar() {
        this.progressBar.style.display = "none";
    }


    private ShowProgressText(value: string) {
        this.progressText.style.display = "block";
        this.progressText.innerText = value;
    }

    private HideProgressText() {
        this.progressText.style.display = "none";
    }

    private ShowError(value: string) {
        this.ShowStatusIcon("fa-file-exclamation");
        this.ShowStatusText(value);
        this.HideProgressBar();
        this.HideProgressText();
    }

    private OnDragOver(evt: DragEvent) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    private OnDragEnter(evt: DragEvent) {
        evt.stopPropagation();
        evt.preventDefault();
    }

    private OnDrop(evt: DragEvent) {
        if( evt.dataTransfer ) {
            this.OnNewFiles(evt.dataTransfer.files);
        }
        else {
            evt.stopPropagation();
            evt.preventDefault();
        }
    }

    private OnChange(evt: Event) {
        if(evt.currentTarget instanceof HTMLInputElement && evt.currentTarget.files) {
            this.OnNewFiles(evt.currentTarget.files);
        }
    }

    private OnNewFiles(files: FileList) {
        if(this.isUploading) return;
        if(files.length === 0) return;
        if(files.length > 1) return this.ShowError("Error: more than one file was selected.");
        this.StartUpload(files[0]);
    }

    private StartUpload(file: File) {
        
        this.isUploading = true;

        this.ShowProgressText("Preparing Upload...")
        this.HideProgressBar();
        this.ShowStatusIcon("fas", "fa-circle-notch", "fa-spin");
        this.ShowStatusText(file.name);

        
        const getTicketXHR = new XMLHttpRequest();
        
        getTicketXHR.open("POST", "/api/v1/files/getUploadTicket", true);
        
        getTicketXHR.timeout = 15 * 1000; // 15 Secconds
        
        getTicketXHR.setRequestHeader("Accept", "application/json");
        getTicketXHR.setRequestHeader("Content-Type", "application/json");
        
        getTicketXHR.addEventListener('load', (evt: ProgressEvent) => {

            if(getTicketXHR.status == 200) {
                let uploadTicket = null;
                try {
                    uploadTicket = JSON.parse(getTicketXHR.responseText);
                }
                catch {
                    return this.ShowError("There was an error preparing the upload");
                }
                // this.UploadWithTicket(file, uploadTicket);
            }
            else {
                return this.ShowError("There was an error preparing the upload");
            }

        });
        getTicketXHR.addEventListener('error', (evt: Event) => this.ShowError("There was an error preparing the upload"));
        getTicketXHR.addEventListener('abort', (evt: Event) => this.ShowError("The file upload was aborted"));
        getTicketXHR.addEventListener('timeout', (evt: ProgressEvent) => this.ShowError("There was an error preparing the upload: Request timed out"));
        
        getTicketXHR.send(JSON.stringify({
            name: file.name,
            type: file.type,
            lastModified: file.lastModified
        }));

    }


}












const MAX_SMALL_FILE_SIZE = 200 * Size.MiB;

class SmallFileUploader {

    private xhr: XMLHttpRequest | null = null;

    private uploadUrl = "";

    UploadFile(file: File) {
        
        this.xhr = new XMLHttpRequest();

        this.xhr.addEventListener('loadstart', this.OnLoadStart.bind(this));
        this.xhr.addEventListener('progress', this.OnProgress.bind(this));
        this.xhr.addEventListener('abort', this.OnAbort.bind(this));
        this.xhr.addEventListener('error', this.OnError.bind(this));
        this.xhr.addEventListener('load', this.OnLoad.bind(this));
        this.xhr.addEventListener('timeout', this.OnTimeout.bind(this));
        this.xhr.addEventListener('loadend', this.OnLoadEnd.bind(this));
        this.xhr.addEventListener('readystatechange', this.OnReadyStateChange.bind(this));

        this.xhr.upload.addEventListener('loadstart', this.OnUploadLoadStart.bind(this))
        this.xhr.upload.addEventListener('progress', this.OnUploadProgress.bind(this));
        this.xhr.upload.addEventListener('abort', this.OnUploadAbort.bind(this));
        this.xhr.upload.addEventListener('error', this.OnUploadError.bind(this));
        this.xhr.upload.addEventListener('load', this.OnUploadLoad.bind(this));
        this.xhr.upload.addEventListener('timeout', this.OnUploadTimeout.bind(this));
        this.xhr.upload.addEventListener('loadend', this.OnUploadLoadEnd.bind(this));
        
        this.xhr.open('POST', this.uploadUrl, true);

        this.xhr.setRequestHeader('X-UPLOAD-FILENAME', file.name);
        this.xhr.setRequestHeader('X-UPLOAD-MIMETYPE', file.type);

        this.xhr.send(file);
    }

    private OnLoadStart(evt: ProgressEvent) { }
    private OnProgress(evt: ProgressEvent) { }
    private OnAbort(evt: Event) { }
    private OnError(evt: Event) { }
    private OnLoad(evt: Event) { }
    private OnTimeout(evt: ProgressEvent) { }
    private OnLoadEnd(evt: ProgressEvent) { }
    private OnReadyStateChange(evt: Event) { }
    private OnUploadLoadStart(evt: ProgressEvent) { }
    private OnUploadProgress(evt: ProgressEvent) { }
    private OnUploadAbort(evt: Event) { }
    private OnUploadError(evt: Event) { }
    private OnUploadLoad(evt: Event) { }
    private OnUploadTimeout(evt: ProgressEvent) { }
    private OnUploadLoadEnd(evt: ProgressEvent) { }

}
















interface UploadTicket {
    fileId: string;
    uploadUrl: string;
    authorizationToken: string;
}
interface MultipartUploadTicket {
    fileId: string;
    uploadUrl: string;
    authorizationToken: string;
    preferredPartSize: number;
    minimumPartSize: number;
}

class B2ClientUploader {

    constructor(private hostApiUrl: string) {

    }

    public async uploadFile(file: File) {

    }

    public async uploadSmallFile(file: File) {}

    public async uploadLargeFile(file: File) {}

    private async getUploadTicket(file: File) {}

    private async getMultipartUploadTicket(file: File) { }

    private async b2_UploadFile(fileData: ArrayBuffer, partNumber: number, partHash: string, uploadTicket: UploadTicket) { }

    private async b2_UploadFilePart(partData: ArrayBuffer, partNumber: number, partHash: string, uploadTicket: UploadTicket) { }



    private async _getMultipartUploadTicket(file: File) {

        const hasher = Rusha.createHash();
        chunkBlob(file, async chunk => hasher.update(await readFileAsync(chunk)));
        const fileHash = hasher.digest();

        const res = await fetch(`${this.hostApiUrl}/getMiltipartUploadTicket`, {
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hash: fileHash,
                name: file.name,
                type: file.type,
                lastModified: file.lastModified
            })
        });

        if (res.ok) return res.json();
    }

    private async _b2_UploadFilePart(partData: ArrayBuffer, partNumber: number, partHash: string, uploadTicket: UploadTicket) {
        return fetch(uploadTicket.uploadUrl, {
            method: "POST",
            headers: {
                "Authorization": uploadTicket.authorizationToken,
                "X-Bz-Part-Number": partNumber.toString(),
                "Accept": "application/json",
                "Content-Length": partData.byteLength.toString(),
                "X-Bz-Content-Sha1": partHash
            },
            body: partData
        });
    }

}

/*
openapi: 3.0.0
info:
  title: Pony.Games API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: https://pony.games/api/v1
    description: Production server
  - url: https://beta.pony.games/api/v1
    description: Testing server
paths:
  /files/generateMultipartUploadTicket:
    post:
      summary: Generates a file upload ticket.
      description: Generates an upload ticket that can be used to upload large files in multiple parts.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  example: MyReallyCoolPicture.png
                mimetype:
                  type: string
                  example: image/png
                hash:
                  type: string
                  example: ed6d46616710d47d1aed3c00bbcd15ec39ce0c5d
                lastmodified:
                  type: string
                  format: date-time
      responses:
        '200':    # status code
          description: The upload ticket
          content:
            application/json:
              schema:
                type: object
                properties:
                  name:

                  */
