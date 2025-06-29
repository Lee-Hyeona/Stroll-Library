# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 기능 설명

# 메인 페이지

// Header
메인 페이지에 헤더를 추가해두었습니다.
헤더는 로고와 add book 버튼으로 구성되어 있습니다.
로고를 클릭하면 메인 홈페이지로 넘어갑니다.
add book 버튼을 클릭하면 책을 정보를 추가하는 페이지로 넘어갑니다.
add book의 마우스를 올려두면 색상이 검정색으로 바뀝니다.
// Category
메인 화면에 카테고리를 추가해두었습니다.
특정 카테고리에 마우스를 올려두면면 내가 선택한 특정 카테고리의 글씨가 진해집니다.
특정 카테고리를 클릭하면 특정 카테고리별 책의 리스트가 책의 등록 최신순으로 뜹니다.
// CardList
메인 화면에는 책을 등록한 최신 순서대로 전체의 책이 뜹니다.
특정 책의 카드에 마우스를 올려두면 이미지는 살짝 확대되고 카드 내용 쪽 색상이 흰색에서 회색으로 바뀝니다.
특정 책의 카드를 클릭하면 책의 상세 페이지로 넘어갑니다.
모바일에서도 웹 페이지가 잘 보일 수 있게 창을 축소해도 카드가 자연스럽게 정렬이 되는 코드로 구현했습니다.

# add book 페이지

책 제목, 저자, 책소개, 책카테고리, 비밀번호, api key를 입력을 받습니다.
입력을 받은 내용을 바탕으로 book cover create 버튼을 클릭하면 표지가 오른쪽에 생성됩니다.
최종적으로 표지가 생성된 후 add book 버튼을 클릭하면 책 정보가 추가됩니다.
추가된 후로 추가가 되었습니다 라는 팝업과 함께 책의 정보가 추가되고 메인 페이지로 넘어갑니다.
메인 페이지에서는 내가 추가한 책의 정보를 카드 형태로 볼 수 있습니다.

# 책 상세 페이지

책 상세 페이지에는 내가 생성한 책의 표지, 카테고리, 책 제목, 저자, 내가 책을 등록한 등록일, 내가 책을 수정한 수정일, 줄거리 내용이 뜹니다.
수정하기 버튼을 누르면 수정 페이지로 넘어가기 전 비밀번호 입력창이 뜹니다.
이 때 비밀번호는 내가 책을 등록할 때 작성하였던 비밀번호를 입력해야합니다.
입력한 비밀번호 값이 초기에 설정한 비밀번호 값이 동일하지 않으면 비밀번호가 틀립니다라는 팝업이 뜨고 수정 페이지로 넘어가지 않게 됩니다.
입력한 비밀번호 값이 초기에 설정한 비밀번호 값이 동일하다면 수정하는 페이지로 넘어가게 됩니다.
삭제하기 버튼을 누르면 삭제하기 전 비밀번호를 입력창이 뜹니다.
입력한 비밀번호 값이 초기에 설정한 비밀번호 값과 동일하지 않으면 비밀번호가 틀립니다는 팝업이 뜨고 삭제가 되지 않습니다.
입력한 비밀번호 값이 초기에 설정한 비밀번호 값과 동일하다면 책은 삭제되고 메인 페이지로 넘어가게 됩니다.

# 수정 페이지

수정 페이지를 불러오면 내가 처음에 책을 등록할 때 있었던 모든 정보들이 불러와집니다.
책 제목, 저자, 책 소개, 책 카테고리, 비밀번호, api key의 내용을 자유롭게 수정이 가능합니다.
책의 표지를 수정하고 싶지 않다면 api키의 값은 입력하지 않아도 됩니다.
책의 표지를 수정하고 싶다면 api 키의 값을 입력한 후 book cover create 버튼을 클릭하면 책의 표지가 다시 생성됩니다.
비밀번호 입력은 내가 초기에 책을 등록했던 비밀번호 값과 동일하게 작성해야합니다.
만약 비밀번호가 동일하지 않다면 책 수정에 실패되었습니다의 팝업이 뜨고 책이 수정되지 않습니다.
비밀번호를 동일하게 입력하고 최종 수정 후 edit버튼을 클릭하면 도서 정보가 수정되었습니다라는 팝업과 함께 책의 정보가 수정되고 메인 페이지로 넘어갑니다.
메인 페이지에서는 내가 수정한 책의 정보를 카드 형태로 볼 수 있습니다.
