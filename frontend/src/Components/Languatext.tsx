const getLanguageFromExtension = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescript';
    case 'json':
      return 'json';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'md':
      return 'markdown';
    case 'txt':
    default:
      return 'plaintext';
  }
};

export default getLanguageFromExtension;
