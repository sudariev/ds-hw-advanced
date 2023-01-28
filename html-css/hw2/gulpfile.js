// import gulp from "gulp";
// const { src, dest, watch, series, parallel } = gulp;
const { src, dest, watch, parallel, series } = require("gulp");

import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import browserSync from "browser-sync";
const bsServer = browserSync.create();

import jsmin from "gulp-js-minify";
import imagemin from "gulp-imagemin";
import rename from "gulp-rename";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

function serve() {
    bsServer.init({
        server: {
            baseDir: "./",
            browser: "firefox",
        },
    });
}

function styles() {
    return src("./src/scss/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie7"], {
                cascade: true,
            })
        )
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(rename("style.min.css"))
        .pipe(dest("./dist/css/"))
        .pipe(bsServer.reload({ stream: true }));
}

function scripts() {
    return src("./src/js/**/*.js")
        .pipe(concat("scripts.min.js"))
        .pipe(uglify())
        .pipe(jsmin())
        .pipe(dest("./dist/js/"))
        .pipe(bsServer.reload({ stream: true }));
}

function images() {
    return src("./src/img/**/*.{jpg,jpeg,png,svg,webp}")
        .pipe(imagemin())
        .pipe(dest("./dist/img"))
        .pipe(bsServer.reload({ stream: true }));
}

function cleanDist() {
    return src("./dist/", {
        allowEmpty: true,
    }).pipe(clean());
}

function watcher() {
    watch("*./html").on("change", bsServer.reload);
    watch("./src/styles/**/*.scss", styles);
    watch("./src/js/*.js", scripts);
    watch("./src/img/**/*.{jpg, jpeg,png,svg,webp}").on(
        "change",
        series(images, bsServer.reload)
    );
}

exports.dev = series(styles, scripts, images, parallel(serve, watcher));
exports.build = series(cleanDist, styles, scripts, images);
