import gulp from "gulp";
const { src, dest, watch, series, parallel } = gulp;

import browserSync from "browser-sync";
const bsServer = browserSync.create();

import autoprefixer from "gulp-autoprefixer";
import clean from "gulp-clean";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import imagemin from "gulp-imagemin";
import jsmin from "gulp-js-minify";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import dartSass from "sass";
const sass = gulpSass(dartSass);

import gulpSass from "gulp-sass";

function cleanDist() {
    return src("./dist/", {
        allowEmpty: true,
    }).pipe(clean());
}

function html() {
    return src("./index.html")
        .pipe(dest("./dist/"))
        .pipe(bsServer.reload({ stream: true }));
}

function images() {
    return src("./src/img/**/*.{jpg,jpeg,png,svg,webp}")
        .pipe(imagemin())
        .pipe(dest("./dist/img"))
        .pipe(bsServer.reload({ stream: true }));
}

function styles() {
    return src("./src/scss/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
                cascade: true,
            })
        )
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(rename("styles.min.css"))
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

function serve() {
    bsServer.init({
        server: {
            baseDir: "./",
        },
    });
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

export const dev = series(
    html,
    styles,
    scripts,
    images,
    parallel(serve, watcher)
);
export const build = series(cleanDist, html, styles, scripts, images);
