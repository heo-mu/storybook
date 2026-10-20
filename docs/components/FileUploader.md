# FileUploader — 개발 노트

> 이 문서는 개발자용 상세 노트입니다. 사용법은 Storybook **Components / FileUploader / 사용 방법**을 보세요.
> Figma 노드 ID · 변수 ID는 현재 Figma 버전(🔵 Ver 0.4)에 속한 보조 정보이며, 대응 기준은 컴포넌트 · 세트 이름입니다([figma-sync.md](../figma-sync.md)).
> 정책 항목 ID(`XXXX-00`)의 출처 · 상태는 [code-policy-audit.md](../code-policy-audit.md).

Figma **File Uploader** 프레임(675:4910)의 `file-uploader`(5개) · `file-uploader-item`(3개)와, 업로드 중 표시에 쓰이는
**Loading**(149:3000)의 `loading`(md · sm)을 구현했습니다.

## 사용 예

```tsx
import { FileUploader, FileUploaderItem } from 'platform-design-system';

const [files, setFiles] = useState<Upload[]>([]);

<FileUploader
  helperText="PDF, HWP, DOCX, JPG, PNG · 파일당 10 MB · 최대 5개"
  accept=".pdf,.hwp,.docx,.jpg,.png"
  multiple
  onFilesSelected={(picked) => startUpload(picked)}
/>

{files.map((f) => (
  <FileUploaderItem
    key={f.id}
    fileName={f.name}
    fileInfo={f.done ? `${f.size} · 업로드 완료` : `${f.size} · 업로드 중\
```
))}`}
/>

크기 · 개수 제한 검사와 업로드 자체는 사용처에서 처리합니다(컴포넌트는 `accept`에 맞는 파일만 전달).

## Figma 속성 → Props

| Figma | Prop | 비고 |
| --- | --- | --- |
| file-uploader Title / Helper Text | `title` · `helperText` | 기본 제목 "파일을 끌어다 놓거나 선택하세요" |
| Show Icon | `showIcon` | 기본 `true` |
| State Hover · Pressed | 브라우저 `:hover` · `:active` | |
| State Drag-over | 파일을 영역 위로 끌 때 자동 | |
| State Disabled | `disabled` | |
| file-uploader-item State Completed · uploading · download · Error | `status` (`error`) | `onRemove` · `onDownload`. Error: 파일 정보 `colors/file-uploader/helper/error`, 삭제 버튼 유지, 버튼 설명에 실패 이유 |
| File Name · File Info | `fileName` · `fileInfo` | 긴 이름은 말줄임 |
| loading size · text | `Loading` `size` · `label` | |
| Title Text · Helper Text | `title` · `helperText` | |

Figma의 "Show Button" 속성은 어떤 레이어에도 연결되어 있지 않아 구현하지 않았습니다(figma-issues F26).

## 정책

Figma **Design System Rules**(Component 섹션의 Rules 227:3774 · 계속 1100:5082)와 컴포넌트 주석이 기준입니다.
항목 앞 ID는 `docs/code-policy-audit.md`(출처 · 처리 상태)의 항목입니다.

### Figma 정의 정책

Figma 변형 · 속성 · 변수 · 스타일로 정의되어 디자인과 코드가 같은 값을 씁니다.

- `FILE-06` **포커스**: 드롭 영역은 키보드 포커스일 때 바깥 2px에 2px `colors/border/focus` 링, 마우스 클릭에는 그리지 않습니다(Figma 속성 `Focus` — file-uploader).

### Figma 문서화 정책

Figma 변형으로 그리지 않는 동작입니다. Figma **Design System Rules**(각 항목의 Rules 장)와 컴포넌트 주석에 정의되어 있습니다.

- `FILE-01` **드롭 영역 = 버튼**: 클릭 · Enter · Space로 파일 선택 창을 엽니다. 도움말 텍스트가 버튼 설명(`aria-describedby`)입니다(Rules 04).
- `FILE-02` **드롭 필터**: 드롭한 파일도 `accept`(확장자 · MIME · `image/*`)로 거르고, `multiple`이 아니면 첫 파일만 전달합니다(Rules 07).
- `FILE-03` **항목 버튼 설명**: "삭제" · "다운로드" 버튼은 파일 이름을 설명으로 가집니다(목록에서 구분, Rules 03).
- `FILE-04` **스피너 회전**: 1초에 한 바퀴, `prefers-reduced-motion`에서는 3초에 한 바퀴(Rules 09).

### 개발 구현 세부 사항

디자인 컴포넌트에 넣지 않는 기술 구현입니다(Design System Rules 10).

- `FILE-05` **점선 테두리**: SVG로 6 / 4 대시를 그립니다. Figma는 대시를 변마다 맞춰 그려 모서리 근처 대시 위치가 최대 3px 다릅니다(수동 검토).

## 상태

## Props

### FileUploader

### FileUploaderItem

### Loading

## 구현 메모 (Storybook에서 옮김)

컴포넌트 JSDoc · 스토리 설명에서 사용자 문서로 옮기지 않은 내용입니다.

- Figma 컴포넌트 세트: `file-uploader`(651:3945, 5개 상태) → `FileUploader`, `file-uploader-item`(651:3999) → `FileUploaderItem`, `loading`(675:5644) → `Loading`.
- `FileUploader` State: Hover · Pressed = `:hover` · `:active`, Drag-over = 파일을 영역 위로 끌 때, Disabled = `disabled`.
- `FileUploader` 영역은 `<button>`이고, 숨겨진 `<input type="file">`이 폼용 선택을 가집니다(`ref`는 이 input을 가리킵니다). Figma 영역 너비는 353px이며 `style`로 지정합니다.
- `FileUploaderItem`의 버튼은 `TextButton`(button_text Primary sm)입니다.
- `Loading`은 `colors/border/transparency` → `colors/border/brand` 그라데이션 호이며, `role="status"`라 라벨(또는 `aria-label`, 기본 "로딩 중")이 정중하게(polite) 읽힙니다.
- `ImageUploadPreview`는 Figma key-value File Upload 셀(`table_value_editable`, 503:23264)의 업로드 이미지입니다: 100px 정사각형, 오른쪽 위 모서리 중앙에 둥근 삭제 버튼(18px, padding p-0_5, `colors/fill/secondary/subtle/default`, 1px `colors/border/gray-subtler`, X 12px `colors/icon/secondary`).


## Storybook 검증 예시의 내부 참고

사용 문서에서 분리한 원본 참조입니다. 현재 동작·정책 안내는 Storybook Usage를 따릅니다.

- `FileUploader.showcase.stories.tsx / DropzoneMatrix`: Figma `file-uploader` (5 states), 353px wide.
- `FileUploader.showcase.stories.tsx / ItemMatrix`: Figma `file-uploader-item` (Completed · uploading · download · Error), 320px wide.
- `FileUploader.showcase.stories.tsx / LoadingMatrix`: Figma `loading` (md · sm) with the label.
