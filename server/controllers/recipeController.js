require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);

    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Cooking Blog-Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


exports.about = async (req, res) => {
  res.render("about");
};

/**
 * GET /categories
 * Categories
 */

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking Blog-Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories
 */

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "Cooking Blog-Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Categories By Id
 */

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog-Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Cooking Blog-Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explore Latest
 */

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", { title: "Cooking Blog-Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    // console.log(random);
    let recipe = await Recipe.findOne().skip(random).exec();
    // res.json(recipe)
    // console.log(recipe);
    res.render("explore-random", { title: "Cooking Blog-Explore-Latest", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};


/**
 * GET /submit-recipe
 * Submit Recipe
 */

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
    res.render("submit-recipe", { title: "Cooking Blog-Submit Recipe",infoErrorsObj,infoSubmitObj });
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */

exports.submitRecipeOnPost = async (req, res) => {
  try{

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length===0){
      console.log("No files were uploaded");
    }else{
      imageUploadFile = req.files.image;
      newImageName = Date.now()+imageUploadFile.name;

      uploadPath = require("path").resolve("./") + "/public/img/" + newImageName;

      imageUploadFile.mv(uploadPath,function(err){
        if(err) return res.status(500).send(err);
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description:req.body.description,
      email:req.body.email,
      ingredients:req.body.ingredients,
      category:req.body.category,
      image:newImageName
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added");
    res.redirect("/submit-recipe");
  }catch(error){
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

// async function insertDummyCategoryData() {
//   try {
//     await Category.insertMany(
//         [
//       {
//         "name": "Thai",
//         "image": "thai.jpg"
//       },

//       {
//         "name": "American",
//         "image": "america.jpg"
//       },

//       {
//         "name": "Chinese",
//         "image": "chinese.jpg"
//       },

//       {
//         "name": "Mexican",
//         "image": "mexican.jpg"
//       },

//       {
//         "name": "Spanish",
//         "image": "spanish.jpg"
//       },

//       {
//         "name": "Indian",
//         "image": "indian.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDummyCategoryData();

// async function insertDummyRecipeData() {
//   try {
//     await Recipe.insertMany([
//       {
//         name: "Thai Green Curry",
//         description:
//           "A delicious and aromatic Thai curry made with coconut milk and green curry paste.",
//         email: "chef@example.com",
//         ingredients: [
//           "Chicken",
//           "Coconut Milk",
//           "Green Curry Paste",
//           "Thai Basil",
//           "Eggplant",
//           "Bell Peppers",
//           "Fish Sauce",
//           "Sugar",
//         ],
//         category: "Thai",
//         image: "thai.jpg",
//       },
//       {
//         name: "Classic American Burger",
//         description:
//           "An all-time favorite American burger with juicy beef patty, cheese, lettuce, and pickles.",
//         email: "chef@example.com",
//         ingredients: [
//           "Beef Patty",
//           "Burger Buns",
//           "Cheddar Cheese",
//           "Lettuce",
//           "Tomato",
//           "Onion",
//           "Pickles",
//           "Ketchup",
//           "Mustard",
//         ],
//         category: "American",
//         image: "america.jpg",
//       },
//       {
//         name: "Chinese Stir-Fried Noodles",
//         description:
//           "A quick and flavorful Chinese noodle dish with stir-fried vegetables and soy sauce.",
//         email: "chef@example.com",
//         ingredients: [
//           "Egg Noodles",
//           "Carrots",
//           "Bell Peppers",
//           "Cabbage",
//           "Green Onions",
//           "Soy Sauce",
//           "Sesame Oil",
//           "Garlic",
//         ],
//         category: "Chinese",
//         image: "chinese.jpg",
//       },
//       {
//         name: "Mexican Tacos",
//         description:
//           "Authentic Mexican tacos with seasoned grilled meat, onions, cilantro, and salsa.",
//         email: "chef@example.com",
//         ingredients: [
//           "Marinated Grilled Meat",
//           "Corn Tortillas",
//           "Onion",
//           "Cilantro",
//           "Salsa",
//           "Lime",
//         ],
//         category: "Mexican",
//         image: "mexican.jpg",
//       },
//       {
//         name: "Indian Butter Chicken",
//         description:
//           "A rich and creamy Indian curry with tender chicken cooked in a tomato-based sauce.",
//         email: "chef@example.com",
//         ingredients: [
//           "Chicken",
//           "Tomatoes",
//           "Butter",
//           "Cream",
//           "Onion",
//           "Garlic",
//           "Ginger",
//           "Garam Masala",
//           "Cumin",
//         ],
//         category: "Indian",
//         image: "butter-chicken.jpg",
//       },
//       {
//         name: "Classic American Pancakes",
//         description:
//           "Fluffy and delicious pancakes, a classic American breakfast favorite.",
//         email: "chef@example.com",
//         ingredients: [
//           "All-Purpose Flour",
//           "Milk",
//           "Eggs",
//           "Sugar",
//           "Baking Powder",
//           "Salt",
//           "Butter",
//           "Maple Syrup",
//         ],
//         category: "American",
//         image: "pancake.jpg",
//       },

//       {
//         name: "Classic American Hot Dog",
//         description:
//           "A traditional American street food staple, featuring a grilled or steamed sausage served in a soft hot dog bun and topped with various condiments.",
//         email: "chef@example.com",
//         ingredients: [
//           "Beef or Pork Sausages",
//           "Hot Dog Buns",
//           "Ketchup",
//           "Mustard",
//           "Relish",
//           "Onions",
//           "Pickles",
//           "Chopped Tomatoes",
//         ],
//         category: "American",
//         image: "hotdog.jpg",
//       },
//       {
//         name: "Southern Fried Chicken",
//         description:
//           "Crispy and flavorful fried chicken, a beloved dish in the Southern United States, often served with sides like mashed potatoes and coleslaw.",
//         email: "chef@example.com",
//         ingredients: [
//           "Chicken Pieces",
//           "Buttermilk",
//           "All-Purpose Flour",
//           "Paprika",
//           "Salt",
//           "Black Pepper",
//           "Vegetable Oil",
//         ],
//         category: "American",
//         image: "rice.jpeg",
//       },
//       {
//         name: "Classic American Apple Pie",
//         description:
//           "An iconic American dessert made with a buttery pastry crust and filled with sliced apples, sugar, and spices, often served with a scoop of vanilla ice cream.",
//         email: "chef@example.com",
//         ingredients: [
//           "Apples",
//           "Granulated Sugar",
//           "Brown Sugar",
//           "Cinnamon",
//           "Nutmeg",
//           "Lemon Juice",
//           "Butter",
//           "All-Purpose Flour",
//         ],
//         category: "American",
//         image: "apple-pie.jpg",
//       },
//       {
//         name: "Pad Thai",
//         description:
//           "A popular Thai stir-fried noodle dish made with rice noodles, shrimp or chicken, tofu, bean sprouts, and a flavorful sauce.",
//         email: "chef@example.com",
//         ingredients: [
//           "Rice Noodles",
//           "Shrimp or Chicken",
//           "Tofu",
//           "Bean Sprouts",
//           "Eggs",
//           "Tamarind Paste",
//           "Fish Sauce",
//           "Palm Sugar",
//           "Chili Flakes",
//           "Garlic",
//           "Lime",
//           "Peanuts",
//           "Green Onions",
//         ],
//         category: "Thai",
//         image: "pad-thai.jpg",
//       },
//       {
//         name: "Tom Yum Goong",
//         description:
//           "A spicy and sour Thai soup with shrimp, lemongrass, kaffir lime leaves, galangal, and a mix of aromatic herbs and spices.",
//         email: "chef@example.com",
//         ingredients: [
//           "Shrimp",
//           "Lemongrass",
//           "Kaffir Lime Leaves",
//           "Galangal",
//           "Mushrooms",
//           "Chili Peppers",
//           "Lime Juice",
//           "Fish Sauce",
//           "Sugar",
//           "Coriander",
//           "Thai Basil",
//         ],
//         category: "Thai",
//         image: "tom-yum-kung.jpg",
//       },
//       {
//         name: "Green Curry",
//         description:
//           "A flavorful Thai curry made with green curry paste, coconut milk, and a variety of vegetables and meat or tofu.",
//         email: "chef@example.com",
//         ingredients: [
//           "Green Curry Paste",
//           "Coconut Milk",
//           "Chicken or Tofu",
//           "Eggplant",
//           "Thai Basil",
//           "Kaffir Lime Leaves",
//           "Green Peas",
//           "Fish Sauce",
//           "Palm Sugar",
//         ],
//         category: "Thai",
//         image: "green-cury.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDummyRecipeData();
