import directories from './structure.json';

interface IFile {
  name: string;
  type: string;
}

interface IFolder {
  code: string;
  name: string;
  type: string;
  children: IFile[];
}

interface ILink {
  name: string;
  url: string;
}

interface IVideo {
  src: string;
  title?: string;
}

interface IImageList {
  file: string;
  path: string;
}

export interface IProject {
  code: string;
  name: string;
  description?: string;
  detail?: string;
  tags?: string[];
  link?: ILink;
  videos?: IVideo[];
  imageNames?: {
    [index: string]: string;
  };
}

export interface IOutputProject {
  code: string;
  name: string;
  description: string;
  detail: string;
  tags: string[];
  link: ILink;
  videos: IVideo[];
  images: {
    [index: string]: string;
  };
}

export interface IOutputProjects {
  [index: string]: IOutputProject;
}

function getImages(children: IFile[], folderName: string) {
  return children.map((file) => ({
    file: file.name,
    path: `./images/projects/${folderName}/${file.name}`,
  }));
}

function parseProject(project: IProject, imagesList: IImageList[] = []) {
  const {
    code,
    name,
    description = '',
    detail = '',
    link = null,
    tags = [],
    imageNames = {},
    videos = [],
  } = project;

  if (!code || !name) return {};

  const images = imagesList.map((image) => ({
    title: imageNames[image.file] ?? '',
    name: image.file,
    src: image.path,
  }));

  return {
    [code]: {
      name,
      description,
      detail,
      link,
      tags,
      images,
      videos,
    },
  };
}

const projects: IOutputProjects = directories.reduce(
  (acc, dir: IFolder) => ({
    ...acc,
    ...parseProject(dir, getImages(dir.children, dir.code)),
  }),
  {},
);

export default projects;
