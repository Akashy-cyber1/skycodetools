# Frontend API Integration TODO

## Task
Update all tool pages to use backend APIs instead of client-side processing.

## Steps

### 1. image-to-pdf/page.tsx
- Replace `convertToPDF` function to call `/api/image-to-pdf` with FormData
- Handle response as blob for PDF download
- Add error handling

### 2. merge-pdf/page.tsx  
- Replace `mergePDFs` function to call `/api/merge-pdf` with FormData
- Handle response as blob for PDF download
- Add error handling

### 3. split-pdf/page.tsx
- Replace `splitPDF` function to call `/api/split-pdf` with FormData (include page ranges)
- Handle response as blob for PDF download
- Add error handling

### 4. image-compressor/page.tsx
- Replace `compressImage` function to call `/api/image-compressor` with FormData
- Handle response as blob for image download
- Add error handling

### 5. background-remover/page.tsx
- Update to call `/api/background-remover` instead of external Remove.bg API
- Handle response as blob for PNG download
- Add error handling

## Notes
- All tools already have loading states and button disabled states
- Need to add error message display states where missing
- Use async/await with try/catch for all API calls
- Use FormData to send files
- Handle response as blob for file downloads

