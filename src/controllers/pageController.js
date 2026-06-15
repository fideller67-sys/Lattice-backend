import NavigationNode from '../models/NavigationNode.js';
import PageContent from '../models/PageContent.js';


export const getNavNodes = async (req, res, next) => {
  try {
    const nodes = await NavigationNode.find().sort({ category: 1, displayOrder: 1 });

    const userRole = req.user.role;
    const filtered = nodes.filter((node) => {
      if (node.isLocked && !['director', 'admin'].includes(userRole)) {
        return false;
      }
      return true;
    });

    res.status(200).json(filtered);
  } catch (error) {
    next(error);
  }
};

export const createNavNode = async (req, res, next) => {
  try {
    const node = await NavigationNode.create(req.body);
    res.status(201).json(node);
  } catch (error) {
    next(error);
  }
};

export const updateNavNode = async (req, res, next) => {
  try {
    const node = await NavigationNode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!node) {
      res.status(404);
      throw new Error('Navigation node not found');
    }
    res.status(200).json(node);
  } catch (error) {
    next(error);
  }
};

export const deleteNavNode = async (req, res, next) => {
  try {
    const node = await NavigationNode.findByIdAndDelete(req.params.id);
    if (!node) {
      res.status(404);
      throw new Error('Navigation node not found');
    }
    res.status(200).json({ message: 'Navigation node removed' });
  } catch (error) {
    next(error);
  }
};


export const getPages = async (req, res, next) => {
  try {
    const pages = await PageContent.find();
    res.status(200).json(pages);
  } catch (error) {
    next(error);
  }
};

export const getPageBySlug = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) {
      res.status(404);
      throw new Error('Page not found');
    }

    const userRole = req.user.role;
    const response = {
      _id: page._id,
      title: page.title,
      slug: page.slug,
      category: page.category,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };

    if (userRole === 'developer' || userRole === 'admin') {
      response.developerPayload = page.developerPayload;
    }
    if (userRole === 'pm' || userRole === 'admin') {
      response.pmPayload = page.pmPayload;
    }
    if (userRole === 'director' || userRole === 'admin') {
      response.directorPayload = page.directorPayload;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createPage = async (req, res, next) => {
  try {
    const page = await PageContent.create(req.body);
    res.status(201).json(page);
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  try {
    const page = await PageContent.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!page) {
      res.status(404);
      throw new Error('Page not found');
    }
    res.status(200).json(page);
  } catch (error) {
    next(error);
  }
};

export const deletePage = async (req, res, next) => {
  try {
    const page = await PageContent.findOneAndDelete({ slug: req.params.slug });
    if (!page) {
      res.status(404);
      throw new Error('Page not found');
    }
    res.status(200).json({ message: 'Page removed' });
  } catch (error) {
    next(error);
  }
};
