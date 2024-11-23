self.onmessage = function(e) {
    const file = e.data;
    const reader = new FileReader();

    reader.onload = function(event) {
        const fileData = event.target.result.replace(/^.*,/, '');
        self.postMessage({
            fileData: fileData,
            fileName: file.name,
            fileType: file.type,
        });
    };

    reader.readAsDataURL(file);
};
