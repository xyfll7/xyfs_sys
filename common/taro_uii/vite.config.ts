// import react from '@vitejs/plugin-react';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://www.raulmelo.me/en/blog/build-javascript-library-with-multiple-entry-points-using-vite-3/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // react({ "jsxRuntime": "classic" }),
    react()
  ],
  build: {
    outDir: "./dist",
    // assetsDir: "./dist/assets",
    sourcemap: true,
    lib: {
      entry: {
        "components/MMMAAPage": "./src/components/MMMAAPage.tsx",
        "components/MMMAddress": "./src/components/MMMAddress.tsx",
        "components/ComImage": "./src/components/ComImage.tsx",
        "components/ComButton": "./src/components/ComButton.tsx",
        "components/ComLoading": "./src/components/ComLoading.tsx",
        "components/MMMLogo": "./src/components/MMMLogo.tsx",
        "components/ComMobileLogin": "./src/components/ComMobileLogin.tsx",
        "components/ComNav": "./src/components/ComNav.tsx",
        "components/ComNavBarA": "./src/components/ComNavBarA.tsx",
        "components/ComNavBarB": "./src/components/ComNavBarB.tsx",
        "components/ComPopupNew": "./src/components/ComPopupNew.tsx",
        "components/ComQRCode": "./src/components/ComQRCode.tsx",
        "components/ComSearcher": "./src/components/ComSearcher.tsx",
        "components/MMMShare": "./src/components/MMMShare.tsx",
        "components/ComTabBarLine": "./src/components/ComTabBarLine.tsx",
        "components/ComSquare": "./src/components/ComSquare.tsx",
        "components/ComTextarea": "./src/components/ComTextarea.tsx",
        "components/ComWeightPrice": "./src/components/ComWeightPrice.tsx",
        "components/ComPaySuccessCard": "./src/components/ComPaySuccessCard.tsx",
        "components/ComAddressSwitchor": "./src/components/ComAddressSwitchor.tsx",
        "components/ComCardOrder": "./src/components/ComCardOrder.tsx",
        "api/api__logistics": "./src/api/api__logistics.ts",
        "api/api__address": "./src/api/api__address.ts",
        "api/api__orders": "./src/api/api__orders.ts",
        "api/api__users": "./src/api/api__users.ts",
        "store/store": "./src/store/store.ts",

        "env": "./src/env.ts",
        "utils/try_catch": "./src/utils/try_catch.ts",
        "utils/bluetooth/useHooks_Blue": "./src/utils/bluetooth/useHooks_Blue.ts",
        "utils/useHooks": "./src/utils/useHooks.ts",
        "utils/util": "./src/utils/util.ts",
        "utils/validator": "./src/utils/validator.ts",

        "compages/CPAddressList": "./src/compages/CPAddressList.tsx",
        "compages/CPExpressPath": "./src/compages/CPExpressPath.tsx",
        "compages/CPImageCropper": "./src/compages/CPImageCropper.tsx",
        "compages/CPExpress": "./src/compages/CPExpress.tsx",
        "compages/CPDryclean": "./src/compages/CPDryclean.tsx",
        "compages/CTestDisplay": "./src/compages/CTestDisplay.tsx",
        "compages/CTestUtils": "./src/compages/CTestUtils.tsx",
      },
      formats: ["es"]
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@tarojs/components',
        '@tarojs/runtime',
        '@tarojs/taro',
        '@tarojs/react',
      ]
    },
  },

});
