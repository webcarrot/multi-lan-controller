export const downloadFile = (content: string, name: string, type: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type });
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};
