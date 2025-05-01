const categories = [
  { id: "1", name: "Tech", description: "Technology category" },
  { id: "2", name: "Fashion", description: "Fashion category" },
];

const categoryResolvers = {
  Query: {
    categories: () => categories,
  },
  Mutation: {
    createCategory: (_: any, { name, description }: any) => {
      const newCategory = {
        id: String(categories.length + 1),
        name,
        description,
      };
      categories.push(newCategory);
      return newCategory;
    },
  },
};

export default categoryResolvers;
