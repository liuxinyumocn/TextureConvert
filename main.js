const fs = require('fs');
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

const ROOT = __dirname;
const isM1 = os.cpus().some((v) => v.model.toLowerCase().indexOf('apple') > -1);

function astc(src, dstPath, astcType = '8x8') {
  let startTime = new Date();
  let exe = 'astcenc-sse4.1.exe';
  if (os.type() === 'Darwin') {
    if (isM1) {
      exe = 'astcenc-neon';
    } else {
      exe = 'astcenc-avx2';
    }
  }
  const cm = spawn(`${ROOT}/libs/${exe}`, ['-cs', src, dstPath + ".astc", astcType, '-medium']);
  cm.stdout.on('data', (data) => {
    //      console.log(`${src} astc stdout: ${data}`);
  });
  cm.stderr.on('data', (data) => {
    // console.error(`${src} astc stderr: ${data}`);
  });
  cm.on('close', (code) => {
    console.log(`【astc】${src.substring(src.lastIndexOf('/') + 1)}  耗时：${new Date() - startTime}ms`);
    fs.rename(dstPath + ".astc", dstPath + ".txt", (err) => {
      if (err) {
        console.error(err, "图片：" + src + " 生成astc压缩纹理失败！");
      }
    });
  });
}

function etc2(src, dstPath) {
  const startTime = new Date();
  const cm = spawn(`${ROOT}/libs/PVRTexToolCLI${os.type() === 'Darwin' ? '' : '.exe'}`, ['-i', src, '-o', dstPath, '-f', 'ETC2_RGBA,UBN,sRGB']);

  cm.stdout.on('data', (data) => {
    //  console.log(`${src} etc2 stdout: ${data}`);
  });

  cm.stderr.on('data', (data) => {
    //   console.error(`${src} etc2 stderr: ${data}`);
  });

  cm.on('close', (code) => {
    console.log(`【etc2】${src.substring(src.lastIndexOf('/') + 1)}  耗时：${new Date() - startTime}ms`);
    const finalDst = dstPath + ".txt";

    fs.rename(dstPath + ".pvr", finalDst, (err) => {
      if (err) {
        console.error("图片：" + src + " 生成etc2压缩纹理失败！");
      } else {
        fs.readFile(finalDst, (e, buffer) => {
          fs.writeFile(finalDst, buffer.slice(52), (e) => {
            if (e) {
              console.error("图片：" + src + " 生成etc2压缩纹理失败！");
            }
          });
        });
      }
    });
  });
}


function dxt5(src, dstPath) {
  const startTime = new Date();
  const cm = spawn(`${ROOT}/libs/PVRTexToolCLI${os.type() === 'Darwin' ? '' : '.exe'}`, ['-i', src, '-o', dstPath + ".dds", '-f', 'BC3,UBN,sRGB']);

  cm.stdout.on('data', (data) => {
    //  console.log(`${src} etc2 stdout: ${data}`);
  });

  cm.stderr.on('data', (data) => {
    //   console.error(`${src} etc2 stderr: ${data}`);
  });

  cm.on('close', (code) => {
    console.log(`【DXT5】${src.substring(src.lastIndexOf('/') + 1)}  耗时：${new Date() - startTime}ms`);
    const finalDst = dstPath + ".txt";

    fs.rename(dstPath + ".dds", finalDst, (err) => {
      if (err) {
        console.error("图片：" + src + " 生dxt5压缩纹理失败！");
      }
    });
  });
}


function pvrtc(src, dstPath) {
  const startTime = new Date();
  const cm = spawn(`${ROOT}/libs/PVRTexToolCLI${os.type() === 'Darwin' ? '' : '.exe'}`, ['-i', src, '-o', dstPath + ".pvr", '-f', 'PVRTC1_4,UBN,sRGB']);
  cm.stdout.on('data', (data) => {
    //  console.log(`${src} etc2 stdout: ${data}`);
  });
  cm.stderr.on('data', (data) => {
    //   console.error(`${src} etc2 stderr: ${data}`);
  });

  cm.on('close', (code) => {
    console.log(`【pvrtc】${src.substring(src.lastIndexOf('/') + 1)}  耗时：${new Date() - startTime}ms`);
    const finalDst = dstPath + ".txt";

    fs.rename(dstPath + ".pvr", finalDst, (err) => {
      if (err) {
        console.error("图片：" + src + " 生pvrtc压缩纹理失败！");
      }
    });
  });
}

let src = '/Users/nebulaliu/Documents/Unity/MyBundleTestWT/Assets/image/d2.png';
let dstPath = '/Users/nebulaliu/Desktop/out/d2';
// astc(src,dstPath); //pass
// etc2(src,dstPath); //pass
// dxt5(src,dstPath); //no
pvrtc(src,dstPath); //no