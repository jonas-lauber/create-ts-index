"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var util = require("util");
var glob = require("glob");
var fs = require("fs");
var chalk = require("chalk");
var path = require("path");
function addDot(ext) {
    if (ext.startsWith('.')) {
        return ext;
    }
    return "." + ext;
}
function addNewline(option, data) {
    if (option.addNewline) {
        return data + '\n';
    }
    return data;
}
function indexWriter(directory, directories, option) {
    return __awaiter(this, void 0, void 0, function () {
        var readDirFunc, writeFileFunc, statFunc, indexFiles, resolvePath_1, elements, targets, stats_1, categorized_1, files_1, sorted, exportString, comment, fileContent, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readDirFunc = util.promisify(fs.readdir);
                    writeFileFunc = util.promisify(fs.writeFile);
                    statFunc = util.promisify(fs.stat);
                    indexFiles = option.targetExts.map(function (targetExt) { return "index." + targetExt; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    console.log(chalk.default.yellow('Current working: ', directory));
                    resolvePath_1 = path.resolve(option.globOptions.cwd);
                    return [4 /*yield*/, readDirFunc(path.join(resolvePath_1, directory))];
                case 2:
                    elements = _a.sent();
                    targets = elements
                        .filter(function (element) { return indexFiles.indexOf(element) < 0; })
                        .filter(function (element) {
                        var isTarget = option.targetExts.reduce(function (result, ext) {
                            return result || addDot(ext) === path.extname(element);
                        }, false);
                        var isHaveTarget = directories.indexOf(path.join(directory, element)) >= 0;
                        return isTarget || isHaveTarget;
                    });
                    return [4 /*yield*/, Promise.all(targets.map(function (target) { return statFunc(path.join(resolvePath_1, directory, target)); }))];
                case 3:
                    stats_1 = _a.sent();
                    categorized_1 = targets.reduce(function (result, target, index) {
                        if (stats_1[index].isDirectory()) {
                            result.dir.push(target);
                        }
                        else {
                            result.allFiles.push(target);
                        }
                        return result;
                    }, { dir: [], allFiles: [] });
                    categorized_1.dir.sort();
                    files_1 = categorized_1.allFiles
                        .filter(function (tsFilePath) {
                        return !option.fileExcludePatterns
                            .map(function (excludePattern) { return new RegExp(excludePattern, 'i'); })
                            .reduce(function (result, regExp) {
                            return result || regExp.test(tsFilePath);
                        }, false);
                    });
                    files_1.sort();
                    sorted = (function () {
                        if (option.fileFirst) {
                            return categorized_1.allFiles.concat(categorized_1.dir);
                        }
                        return categorized_1.dir.concat(files_1);
                    })();
                    exportString = sorted.map(function (target) {
                        var targetFileWithoutExt = target;
                        option.targetExts.forEach(function (ext) {
                            return targetFileWithoutExt = targetFileWithoutExt.replace(addDot(ext), '');
                        });
                        if (option.useSemicolon) {
                            return "export * from './" + targetFileWithoutExt + "';";
                        }
                        return "export * from './" + targetFileWithoutExt + "'";
                    });
                    comment = (function () {
                        if (option.useTimestamp) {
                            return "// created from 'create-ts-index' " + moment(new Date()).format('YYYY-MM-DD HH:mm') + "\n\n"; // tslint:disable-line
                        }
                        return "// created from 'create-ts-index'\n\n"; // tslint:disable-line
                    })();
                    fileContent = comment + addNewline(option, exportString.join('\n'));
                    return [4 /*yield*/, writeFileFunc(path.join(resolvePath_1, directory, 'index.ts'), fileContent, 'utf8')];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.log(chalk.default.red('indexWriter: ', err_1.message));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.indexWriter = indexWriter;
function createTypeScriptIndex(_option) {
    return __awaiter(this, void 0, void 0, function () {
        var option_1, targetFileGlob, globFunc, allTsFiles, allTsFilesNormalized, tsFiles, dupLibDirs, dirSet_1, tsDirs_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    option_1 = Object.assign({}, _option);
                    if (!option_1.globOptions) {
                        option_1.globOptions = {};
                    }
                    option_1.fileFirst = option_1.fileFirst || false;
                    option_1.addNewline = option_1.addNewline || true;
                    option_1.useSemicolon = option_1.useSemicolon || true;
                    option_1.useTimestamp = option_1.useTimestamp || false;
                    option_1.includeCWD = option_1.includeCWD || true;
                    option_1.fileExcludePatterns = option_1.fileExcludePatterns || [];
                    option_1.globOptions.cwd = option_1.globOptions.cwd || process.cwd();
                    option_1.globOptions.nonull = option_1.globOptions.nonull || true;
                    option_1.globOptions.dot = option_1.globOptions.dot || true;
                    option_1.excludes = option_1.excludes || [
                        '@types', 'typings', '__test__', '__tests__', 'node_modules',
                    ];
                    option_1.targetExts = option_1.targetExts || ['ts', 'tsx'];
                    option_1.targetExts = option_1.targetExts.sort(function (l, r) { return r.length - l.length; });
                    targetFileGlob = option_1.targetExts.map(function (ext) { return "*." + ext; }).join('|');
                    globFunc = util.promisify(glob);
                    return [4 /*yield*/, globFunc("**/+(" + targetFileGlob + ")", option_1.globOptions)];
                case 1:
                    allTsFiles = _a.sent();
                    allTsFilesNormalized = allTsFiles.map(path.normalize);
                    tsFiles = allTsFilesNormalized
                        // Step 1, remove exclude directory
                        .filter(function (tsFilePath) {
                        return !option_1.excludes.reduce(function (result, exclude) {
                            return result || tsFilePath.indexOf(exclude) >= 0;
                        }, false);
                    })
                        // Step 2, remove declare file(*.d.ts)
                        .filter(function (tsFilePath) { return !tsFilePath.endsWith('.d.ts'); })
                        // Step 3, remove exclude pattern
                        .filter(function (tsFilePath) {
                        return !option_1.fileExcludePatterns
                            .map(function (excludePattern) { return new RegExp(excludePattern, 'i'); })
                            .reduce(function (result, regExp) {
                            return result || regExp.test(path.basename(tsFilePath));
                        }, false);
                    })
                        // Step 4, remove index file(index.ts, index.tsx etc ...)
                        .filter(function (tsFilePath) {
                        return !option_1.targetExts
                            .map(function (ext) { return "index." + ext; })
                            .reduce(function (result, indexFile) {
                            return result || tsFilePath.indexOf(indexFile) >= 0;
                        }, false);
                    });
                    dupLibDirs = tsFiles
                        .filter(function (tsFile) { return tsFile.split(path.sep).length > 1; })
                        .map(function (tsFile) {
                        var splitted = tsFile.split(path.sep);
                        var allPath = Array(splitted.length - 1)
                            .fill(0)
                            .map(function (_, index) { return index + 1; })
                            .map(function (index) {
                            var a = splitted.slice(0, index).join(path.sep);
                            return a;
                        });
                        return allPath;
                    })
                        .reduce(function (aggregated, libPath) {
                        return aggregated.concat(libPath);
                    }, []);
                    dirSet_1 = new Set();
                    dupLibDirs.forEach(function (dir) { return dirSet_1.add(dir); });
                    tsFiles.map(function (tsFile) { return path.dirname(tsFile); }).forEach(function (dir) { return dirSet_1.add(dir); });
                    tsDirs_1 = Array.from(dirSet_1);
                    if (option_1.includeCWD) {
                        tsDirs_1.push('.');
                    }
                    tsDirs_1.sort(function (left, right) {
                        var llen = left.split(path.sep).length;
                        var rlen = right.split(path.sep).length;
                        if (llen > rlen) {
                            return -1;
                        }
                        if (llen < rlen) {
                            return 1;
                        }
                        return 0;
                    });
                    return [4 /*yield*/, Promise.all(tsDirs_1.map(function (tsDir) { return indexWriter(tsDir, tsDirs_1, option_1); }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.log(chalk.default.red(err_2.message));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createTypeScriptIndex = createTypeScriptIndex;
//# sourceMappingURL=createTypeScriptIndex.js.map