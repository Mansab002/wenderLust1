
// const Listing = require("../models/listing")
// const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxgeocoding({ accessToken: mapToken });





// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// };

// module.exports.renderNewForm = (req, res) => {
//     res.render("listings/new.ejs");
// };

// module.exports.showListing = async (req, res) => {
//     let { id } = req.params;

//     const listing = await Listing.findById(id)
//         .populate({
//             path: "reviews",
//             populate: { path: "author" },
//         })
//         .populate("owner");

//     if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         res.redirect("/listings");
//     }

//     res.render("listings/show.ejs", { listing });
// };


// module.exports.createListing = async (req, res, next) => {
//     let response = await geocodingClient.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1
//     })
//         .send()

//     let url = req.file.path;
//     let filename = req.file.filename;


//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id
//     newListing.image = { url, filename };

//     newListing.geometry = response.body.features[0].geometry;


//     let saveListing = await newListing.save();
//     console.log(saveListing);
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         return res.redirect("/listings");
//     }
//     let OriginalImageUrl = listing.image.url;
//     OriginalImageUrl = OriginalImageUrl.replace("/upload", "/upload/h_300,w_250");
//     res.render("listings/edit.ejs", { listing, OriginalImageUrl });
// };

// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

//     if (typeof req.file !== "undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = { url, filename };
//         await listing.save();
//     }

//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing Deleted!");
//     res.redirect("/listings");
// };

const Listing = require("../models/listing");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Sorry! your requested listing doesnot exist...");
        res.redirect("/listings");
    }

    let response = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
    }).send()
    listing.geometry = response.body.features[0].geometry;
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()

    let url = req.file.path;
    let filename = req.file.filename;


    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;


    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, OriginalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// module.exports.destroyListing = async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing Deleted!");
//     res.redirect("/listings");
// };
module.exports.destroyListing = async (req, res) => {
    console.log("🔥 Destroy route hit");
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};