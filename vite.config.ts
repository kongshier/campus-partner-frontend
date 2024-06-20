import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from 'unplugin-vue-components/resolvers';

export default {
    plugins: [
        vue(),
        Components({
            resolvers: [VantResolver()],
        }),
    ],
<<<<<<< HEAD
    // server: {
    //     host: '0.0.0.0',
    //     port: 5173,
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //     },
    //     hmr: {
    //         protocol: 'ws',
    //         host: '0.0.0.0',
    //         port: 5173,
    //     },
    // }
};
=======
};
>>>>>>> 8ab55d390715761591ba27ce25d08cb2d5d86a24
