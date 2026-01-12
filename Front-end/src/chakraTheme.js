import { extendTheme } from '@chakra-ui/react'

const customTheme = extendTheme({
    components: {
        Table: {
            baseStyle: {
                th: {
                    height: '48px',
                    backgroundColor: 'rgba(150, 133, 242, 1)',
                    color: 'white',
                },
                tr: {
                    borderRadius: '7px',
                    marginTop: '20px',
                },
            },
        },
        Modal: {
            sizes: {
                900: {
                    dialogStyles: {
                        width: '706px',
                        height: '618px',
                    },
                },
                500: {
                    dialogStyles: {
                        width: '555px',
                        height: '383px',
                    },
                },
            },
        },
    },
})

export default customTheme
