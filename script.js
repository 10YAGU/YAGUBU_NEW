(function () {
    'use strict';

    var STORAGE_KEYS = { 
        NOTICES: 'yagubu_notices',
        SCHEDULES: 'yagubu_schedules',
        MEDIA: 'yagubu_media',
        PLAYERS: 'yagubu_players',
        PERSONAL: 'yagubu_personal_records',
        PITCHER: 'yagubu_pitcher_records',
        GAME_BATTING_LINES: 'yagubu_game_batting_lines',
        GAME_PITCHING_LINES: 'yagubu_game_pitching_lines',
        GAME_OPPONENT_BATTING_LINES: 'yagubu_game_opponent_batting_lines',
        GAME_OPPONENT_PITCHING_LINES: 'yagubu_game_opponent_pitching_lines',
        COMMUNITY: 'yagubu_community_posts',
        COMMUNITY_COMMENTS: 'yagubu_community_comments',
        GALLERY: 'yagubu_gallery_items',
        LEAGUE_FILTER: 'yagubu_league_filter',
        TEAM_STORY: 'yagubu_team_story',
        TEAM_VALUES: 'yagubu_team_values',
        TEAM_HISTORY: 'yagubu_team_history',
        AUTH: 'yagubu_auth'
    };

    // =========================
    // Supabase (공유 저장소)
    // =========================
    // Supabase 프로젝트 설정은 `supabase-config.js`(window.SUPABASE_*)로 주입합니다.
    // 값이 비어 있으면 기존 localStorage 모드로 동작합니다.
    var SUPABASE_URL = (window.SUPABASE_URL || '').trim();
    var SUPABASE_ANON_KEY = (window.SUPABASE_ANON_KEY || '').trim();

    var sb = null;
    function isSupabaseReady() {
        return !!(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase && typeof window.supabase.createClient === 'function');
    }
    function initSupabase() {
        if (!isSupabaseReady()) return null;
        if (sb) return sb;
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return sb;
    }

    // 로그인
    var loginBtn = document.getElementById('loginBtn');
    var loginUserLabel = document.getElementById('loginUserLabel');
    var loginForm = document.getElementById('loginForm');
    var loginLocalFields = document.getElementById('loginLocalFields');
    var loginSupabaseFields = document.getElementById('loginSupabaseFields');
    var loginName = document.getElementById('loginName');
    var loginPhoneLast4 = document.getElementById('loginPhoneLast4');
    var loginEmail = document.getElementById('loginEmail');
    var loginPassword = document.getElementById('loginPassword');
    var loginMessage = document.getElementById('loginMessage');

    var noticeAddModal = document.getElementById('noticeAddModal');
    var noticeListModal = document.getElementById('noticeListModal');
    var noticeAddForm = document.getElementById('noticeAddForm');
    var noticeList = document.getElementById('noticeList');
    var noticeFullList = document.getElementById('noticeFullList');
    var noticeAddBtn = document.getElementById('noticeAddBtn');
    var noticeMoreBtn = document.getElementById('noticeMoreBtn');
    var noticeSearchBtn = document.getElementById('noticeSearchBtn');
    var noticeListDeleteBtn = document.getElementById('noticeListDeleteBtn');
    var noticeDeleteBtn = document.getElementById('noticeDeleteBtn');
    var noticeStartDate = document.getElementById('noticeStartDate');
    var noticeEndDate = document.getElementById('noticeEndDate');
    var noticeTitle = document.getElementById('noticeTitle');
    var noticeDate = document.getElementById('noticeDate');
    var noticeContent = document.getElementById('noticeContent');
    var selectedNoticeId = null;
    var editingNoticeId = null;

    // 시즌(리그 선택)
    var leagueSelect = document.getElementById('leagueSelect');

    // 커뮤니티(하단)
    var communityList = document.getElementById('communityList');
    var communityAddBtn = document.getElementById('communityAddBtn');
    var communityMoreBtn = document.getElementById('communityMoreBtn');
    var communityAddForm = document.getElementById('communityAddForm');
    var communityTitle = document.getElementById('communityTitle');
    var communityDate = document.getElementById('communityDate');
    var communityTime = document.getElementById('communityTime');
    var communityContent = document.getElementById('communityContent');
    var communityAuthor = document.getElementById('communityAuthor');
    var communityStartDate = document.getElementById('communityStartDate');
    var communityEndDate = document.getElementById('communityEndDate');
    var communitySearchBtn = document.getElementById('communitySearchBtn');
    var communityFullList = document.getElementById('communityFullList');
    var communityModalTitle = document.getElementById('communityModalTitle');
    var communityDeleteBtn = document.getElementById('communityDeleteBtn');
    var communityViewTitle = document.getElementById('communityViewTitle');
    var communityViewMeta = document.getElementById('communityViewMeta');
    var communityViewContent = document.getElementById('communityViewContent');
    var communityViewEditBtn = document.getElementById('communityViewEditBtn');
    var communityViewDeleteBtn = document.getElementById('communityViewDeleteBtn');
    var communityPrevBtn = document.getElementById('communityPrevBtn');
    var communityNextBtn = document.getElementById('communityNextBtn');
    var communityCommentsCount = document.getElementById('communityCommentsCount');
    var communityCommentsList = document.getElementById('communityCommentsList');
    var communityCommentForm = document.getElementById('communityCommentForm');
    var communityCommentText = document.getElementById('communityCommentText');
    var communityCommentSubmitBtn = document.getElementById('communityCommentSubmitBtn');
    var communityLikeBtn = document.getElementById('communityLikeBtn');
    var communityLikeCount = document.getElementById('communityLikeCount');
    var viewingCommunityId = null;
    var editingCommunityId = null;
    var communityNavIds = [];
    var communityNavIndex = -1;

    // 갤러리(하단)
    var galleryGrid = document.getElementById('galleryGrid');
    var galleryAddBtn = document.getElementById('galleryAddBtn');
    var galleryMoreBtn = document.getElementById('galleryMoreBtn');
    var galleryAddForm = document.getElementById('galleryAddForm');
    var galleryModalTitle = document.getElementById('galleryModalTitle');
    var galleryAuthor = document.getElementById('galleryAuthor');
    var galleryDate = document.getElementById('galleryDate');
    var galleryTime = document.getElementById('galleryTime');
    var galleryShortText = document.getElementById('galleryShortText');
    var galleryContent = document.getElementById('galleryContent');
    var galleryEventDate = document.getElementById('galleryEventDate');
    var galleryAlbumName = document.getElementById('galleryAlbumName');
    var galleryTags = document.getElementById('galleryTags');
    var galleryPhotoFile = document.getElementById('galleryPhotoFile');
    var galleryPhotoPreview = document.getElementById('galleryPhotoPreview');
    var galleryPhotoPreviewImg = document.getElementById('galleryPhotoPreviewImg');
    var galleryDeleteBtn = document.getElementById('galleryDeleteBtn');
    var galleryFullGrid = document.getElementById('galleryFullGrid');
    var galleryFilterAlbum = document.getElementById('galleryFilterAlbum');
    var galleryFilterTag = document.getElementById('galleryFilterTag');
    var galleryListFilterAlbum = document.getElementById('galleryListFilterAlbum');
    var galleryListFilterTag = document.getElementById('galleryListFilterTag');
    var galleryViewTitle = document.getElementById('galleryViewTitle');
    var galleryViewMeta = document.getElementById('galleryViewMeta');
    var galleryViewShort = document.getElementById('galleryViewShort');
    var galleryViewImg = document.getElementById('galleryViewImg');
    var galleryViewContent = document.getElementById('galleryViewContent');
    var galleryViewDownloadBtn = document.getElementById('galleryViewDownloadBtn');
    var galleryViewEditBtn = document.getElementById('galleryViewEditBtn');
    var galleryViewDeleteBtn = document.getElementById('galleryViewDeleteBtn');
    var viewingGalleryId = null;
    var editingGalleryId = null;

    // 경기 일정 관련
    var scheduleAddModal = document.getElementById('scheduleAddModal');
    var scheduleAddForm = document.getElementById('scheduleAddForm');
    var scheduleList = document.getElementById('scheduleList');
    var scheduleDdayWrap = document.getElementById('scheduleDdayWrap');
    var scheduleDday = document.getElementById('scheduleDday');
    var scheduleAddBtn = document.getElementById('scheduleAddBtn');
    var scheduleMoreBtn = document.getElementById('scheduleMoreBtn');
    var scheduleFullList = document.getElementById('scheduleFullList');
    var scheduleStartDate = document.getElementById('scheduleStartDate');
    var scheduleEndDate = document.getElementById('scheduleEndDate');
    var scheduleSearchBtn = document.getElementById('scheduleSearchBtn');
    var scheduleLeagueFilter = document.getElementById('scheduleLeagueFilter');
    var scheduleLeague = document.getElementById('scheduleLeague');
    var scheduleDate = document.getElementById('scheduleDate');
    var scheduleTime = document.getElementById('scheduleTime');
    var scheduleOpponent = document.getElementById('scheduleOpponent');
    var scheduleLocation = document.getElementById('scheduleLocation');
    var scheduleStatus = document.getElementById('scheduleStatus');
    var scheduleBatOrder = document.getElementById('scheduleBatOrder');
    var scheduleModalTitle = document.getElementById('scheduleModalTitle');
    var scheduleDeleteBtn = document.getElementById('scheduleDeleteBtn');
    var scheduleResult = document.getElementById('scheduleResult');
    var scheduleResultRow = document.getElementById('scheduleResultRow');
    var scheduleScoreRow = document.getElementById('scheduleScoreRow');
    var scheduleOurScore = document.getElementById('scheduleOurScore');
    var scheduleOpponentScore = document.getElementById('scheduleOpponentScore');
    var seasonScheduleAddBtn = document.getElementById('seasonScheduleAddBtn');
    var seasonScheduleMoreBtn = document.getElementById('seasonScheduleMoreBtn');
    var seasonScheduleTableBody = document.getElementById('seasonScheduleTableBody');
    var gameScorecardModalTitle = document.getElementById('gameScorecardModalTitle');
    var gameScorecardInfo = document.getElementById('gameScorecardInfo');
    var gameBattingLinesBody = document.getElementById('gameBattingLinesBody');
    var gamePitchingLinesBody = document.getElementById('gamePitchingLinesBody');
    var gameOpponentBattingLinesBody = document.getElementById('gameOpponentBattingLinesBody');
    var gameOpponentPitchingLinesBody = document.getElementById('gameOpponentPitchingLinesBody');
    var gameBattingAddRowBtn = document.getElementById('gameBattingAddRowBtn');
    var gamePitchingAddRowBtn = document.getElementById('gamePitchingAddRowBtn');
    var gameOpponentBattingAddRowBtn = document.getElementById('gameOpponentBattingAddRowBtn');
    var gameOpponentPitchingAddRowBtn = document.getElementById('gameOpponentPitchingAddRowBtn');
    var gameScorecardSaveBtn = document.getElementById('gameScorecardSaveBtn');
    var currentScorecardScheduleId = null;
    var currentScorecardPlayers = [];
    var statsWinRate = document.getElementById('statsWinRate');
    var statsWin = document.getElementById('statsWin');
    var statsLoss = document.getElementById('statsLoss');
    var statsDraw = document.getElementById('statsDraw');
    var statsLeagueLabel = document.getElementById('statsLeagueLabel');

    var editingScheduleId = null;

    // 개인기록(선수/기록)
    var personalRecordAddBtn = document.getElementById('personalRecordAddBtn');
    var personalRecordMoreBtn = document.getElementById('personalRecordMoreBtn');
    var personalRecordTableBody = document.getElementById('personalRecordTableBody');
    var personalRecordModalTitle = document.getElementById('personalRecordModalTitle');
    var personalRecordForm = document.getElementById('personalRecordForm');
    var prJerseyNo = document.getElementById('prJerseyNo');
    var prName = document.getElementById('prName');
    var prPA = document.getElementById('prPA');
    var prAB = document.getElementById('prAB');
    var prH = document.getElementById('prH');
    var prRBI = document.getElementById('prRBI');
    var prR = document.getElementById('prR');
    var prBB = document.getElementById('prBB');
    var prSO = document.getElementById('prSO');
    var prSB = document.getElementById('prSB');
    var prAVG = document.getElementById('prAVG');
    var prLeague = document.getElementById('prLeague');
    var personalRecordDeleteBtn = document.getElementById('personalRecordDeleteBtn');
    var editingPersonalPlayerId = null;
    var editingPersonalLeagueId = null;
    var personalRecordFullBody = document.getElementById('personalRecordFullBody');

    // 투수기록
    var pitcherRecordTableBody = document.getElementById('pitcherRecordTableBody');
    var pitcherRecordAddBtn = document.getElementById('pitcherRecordAddBtn');
    var pitcherRecordMoreBtn = document.getElementById('pitcherRecordMoreBtn');
    var pitcherRecordModalTitle = document.getElementById('pitcherRecordModalTitle');
    var pitcherRecordForm = document.getElementById('pitcherRecordForm');
    var pitcherRecordDeleteBtn = document.getElementById('pitcherRecordDeleteBtn');
    var pitchLeague = document.getElementById('pitchLeague');
    var pitchJerseyNo = document.getElementById('pitchJerseyNo');
    var pitchName = document.getElementById('pitchName');
    var pitchIp = document.getElementById('pitchIp');
    var pitchH = document.getElementById('pitchH');
    var pitchEr = document.getElementById('pitchEr');
    var pitchW = document.getElementById('pitchW');
    var pitchL = document.getElementById('pitchL');
    var pitchSv = document.getElementById('pitchSv');
    var pitchEra = document.getElementById('pitchEra');
    var pitcherRecordFullBody = document.getElementById('pitcherRecordFullBody');
    var editingPitcherPlayerId = null;
    var editingPitcherLeagueId = null;

    // 팀기록 탭
    var teamBattingAvg = document.getElementById('teamBattingAvg');
    var teamEra = document.getElementById('teamEra');
    var teamRecentRecord = document.getElementById('teamRecentRecord');
    var rankAvgBody = document.getElementById('rankAvgBody');
    var rankHitsBody = document.getElementById('rankHitsBody');
    var rankRbiBody = document.getElementById('rankRbiBody');
    var rankSbBody = document.getElementById('rankSbBody');

    // 팀 소개: 연혁/비전
    var teamStoryEditBtn = document.getElementById('teamStoryEditBtn');
    var teamValuesEditBtn = document.getElementById('teamValuesEditBtn');
    var teamHistoryEditBtn = document.getElementById('teamHistoryEditBtn');
    var teamHistoryMoreBtn = document.getElementById('teamHistoryMoreBtn');
    var teamStoryContent = document.getElementById('teamStoryContent');
    var teamValuesContent = document.getElementById('teamValuesContent');
    var teamHistoryContent = document.getElementById('teamHistoryContent');

    var teamStoryForm = document.getElementById('teamStoryForm');
    var teamValuesForm = document.getElementById('teamValuesForm');
    var teamHistoryForm = document.getElementById('teamHistoryForm');
    var teamStoryText = document.getElementById('teamStoryText');
    var teamValuesText = document.getElementById('teamValuesText');
    var teamHistoryText = document.getElementById('teamHistoryText');
    var teamHistoryYear = document.getElementById('teamHistoryYear');
    var teamStoryDeleteBtn = document.getElementById('teamStoryDeleteBtn');
    var teamValuesDeleteBtn = document.getElementById('teamValuesDeleteBtn');
    var teamHistoryDeleteBtn = document.getElementById('teamHistoryDeleteBtn');

    // 연혁 MORE/행 수정
    var teamHistoryRowAddBtn = document.getElementById('teamHistoryRowAddBtn');
    var teamHistoryFullBody = document.getElementById('teamHistoryFullBody');
    var teamHistoryRowModalTitle = document.getElementById('teamHistoryRowModalTitle');
    var teamHistoryRowForm = document.getElementById('teamHistoryRowForm');
    var teamHistoryRowYear = document.getElementById('teamHistoryRowYear');
    var teamHistoryRowContent = document.getElementById('teamHistoryRowContent');
    var teamHistoryRowDeleteBtn = document.getElementById('teamHistoryRowDeleteBtn');
    var editingHistoryRowIndex = null;

    // 선수단 구성
    var playerAddBtn = document.getElementById('playerAddBtn');
    var playerMoreBtn = document.getElementById('playerMoreBtn');
    var playerTableBody = document.getElementById('playerTableBody');
    var playerFullBody = document.getElementById('playerFullBody');
    var playerModalTitle = document.getElementById('playerModalTitle');
    var playerForm = document.getElementById('playerForm');
    var playerJerseyNo = document.getElementById('playerJerseyNo');
    var playerName = document.getElementById('playerName');
    var playerPrimaryPos = document.getElementById('playerPrimaryPos');
    var playerSecondaryPos = document.getElementById('playerSecondaryPos');
    var playerRole = document.getElementById('playerRole');
    var playerStatus = document.getElementById('playerStatus');
    var playerContact = document.getElementById('playerContact');
    var playerDeleteBtn = document.getElementById('playerDeleteBtn');
    var editingPlayerId = null;

    var mediaAddModal = document.getElementById('mediaAddModal');
    var mediaAddForm = document.getElementById('mediaAddForm');
    var mediaList = document.getElementById('mediaList');
    var mediaAddBtn = document.getElementById('mediaAddBtn');
    var mediaEditBtn = document.getElementById('mediaEditBtn');
    var mediaMoreBtn = document.getElementById('mediaMoreBtn');
    var mediaFullList = document.getElementById('mediaFullList');
    var mediaFilterType = document.getElementById('mediaFilterType');
    var mediaSearchBtn = document.getElementById('mediaSearchBtn');
    var mediaType = document.getElementById('mediaType');
    var mediaTitle = document.getElementById('mediaTitle');
    var mediaPhotoFile = document.getElementById('mediaPhotoFile');
    var mediaVideoUrl = document.getElementById('mediaVideoUrl');
    var mediaYoutubeUrl = document.getElementById('mediaYoutubeUrl');
    var mediaRowPhoto = document.getElementById('mediaRowPhoto');
    var mediaRowVideo = document.getElementById('mediaRowVideo');
    var mediaRowYoutube = document.getElementById('mediaRowYoutube');
    var mediaPreviewModal = document.getElementById('mediaPreviewModal');
    var mediaPreviewTitle = document.getElementById('mediaPreviewTitle');
    var mediaPreviewContent = document.getElementById('mediaPreviewContent');
    var mediaYoutubeLink = document.getElementById('mediaYoutubeLink');
    var mediaModalTitle = document.getElementById('mediaModalTitle');
    var mediaPhotoPreview = document.getElementById('mediaPhotoPreview');
    var mediaPhotoPreviewImg = document.getElementById('mediaPhotoPreviewImg');
    var mediaDeleteBtn = document.getElementById('mediaDeleteBtn');

    var selectedMediaId = null;
    var editingMediaId = null;

    function getNotices() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveNotices(arr) {
        localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(arr));
    }

    function getSchedules() {
        try {
            var arr = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULES) || '[]');
            // 리그 도입 전 데이터 호환
            var changed = false;
            (arr || []).forEach(function (s) {
                if (s && !s.leagueId) {
                    s.leagueId = 'nono';
                    changed = true;
                }
            });
            if (changed) localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(arr || []));
            return arr || [];
        } catch (e) {
            return [];
        }
    }

    function saveSchedules(arr) {
        localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(arr));
    }

    function getMedia() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.MEDIA) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveMedia(arr) {
        localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(arr));
    }

    function getPlayers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYERS) || '[]');
        } catch (e) {
            return [];
        }
    }

    function savePlayers(arr) {
        localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(arr));
    }

    function getPersonalRecords() {
        try {
            var arr = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERSONAL) || '[]');
            // 리그 도입 전 데이터 호환: leagueId 없으면 노노로 처리
            var changed = false;
            (arr || []).forEach(function (r) {
                if (r && !r.leagueId) {
                    r.leagueId = 'nono';
                    changed = true;
                }
            });
            if (changed) localStorage.setItem(STORAGE_KEYS.PERSONAL, JSON.stringify(arr || []));
            return arr || [];
        } catch (e) {
            return [];
        }
    }

    function savePersonalRecords(arr) {
        localStorage.setItem(STORAGE_KEYS.PERSONAL, JSON.stringify(arr));
    }

    function getPitcherRecords() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.PITCHER) || '[]');
        } catch (e) {
            return [];
        }
    }

    function savePitcherRecords(arr) {
        localStorage.setItem(STORAGE_KEYS.PITCHER, JSON.stringify(arr || []));
    }

    function getGameBattingLines() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_BATTING_LINES) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveGameBattingLines(arr) {
        localStorage.setItem(STORAGE_KEYS.GAME_BATTING_LINES, JSON.stringify(arr || []));
    }

    function getGamePitchingLines() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_PITCHING_LINES) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveGamePitchingLines(arr) {
        localStorage.setItem(STORAGE_KEYS.GAME_PITCHING_LINES, JSON.stringify(arr || []));
    }

    function getGameOpponentBattingLines() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_OPPONENT_BATTING_LINES) || '[]');
        } catch (e) {
            return [];
        }
    }
    function saveGameOpponentBattingLines(arr) {
        localStorage.setItem(STORAGE_KEYS.GAME_OPPONENT_BATTING_LINES, JSON.stringify(arr || []));
    }
    function getGameOpponentPitchingLines() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_OPPONENT_PITCHING_LINES) || '[]');
        } catch (e) {
            return [];
        }
    }
    function saveGameOpponentPitchingLines(arr) {
        localStorage.setItem(STORAGE_KEYS.GAME_OPPONENT_PITCHING_LINES, JSON.stringify(arr || []));
    }

    function getCommunityPosts() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveCommunityPosts(arr) {
        localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(arr || []));
    }

    function getCommunityComments() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY_COMMENTS) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveCommunityComments(arr) {
        localStorage.setItem(STORAGE_KEYS.COMMUNITY_COMMENTS, JSON.stringify(arr || []));
    }

    function getCommunityLikes() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITY_LIKES) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveCommunityLikes(arr) {
        localStorage.setItem(STORAGE_KEYS.COMMUNITY_LIKES, JSON.stringify(arr || []));
    }

    function getGalleryItems() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveGalleryItems(arr) {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(arr || []));
    }

    // =========================
    // Data layer (Supabase or localStorage fallback)
    // =========================
    var LEAGUES = [
        { id: 'nono', name: '노노리그' },
        { id: 'dongguk', name: '동국대리그' }
    ];

    function normalizeLeagueId(v) {
        return String(v || '').trim() === 'dongguk' ? 'dongguk' : 'nono';
    }

    function leagueName(id) {
        var x = String(id || '').trim();
        for (var i = 0; i < LEAGUES.length; i++) {
            if (LEAGUES[i].id === x) return LEAGUES[i].name;
        }
        return x ? x : '';
    }

    function getSelectedLeague() {
        // '' means 전체
        var v = '';
        if (leagueSelect && leagueSelect.value !== undefined) v = String(leagueSelect.value || '');
        else v = String(localStorage.getItem(STORAGE_KEYS.LEAGUE_FILTER) || '');
        return v === 'dongguk' ? 'dongguk' : (v === 'nono' ? 'nono' : '');
    }

    function setSelectedLeague(v) {
        var x = v === 'dongguk' ? 'dongguk' : (v === 'nono' ? 'nono' : '');
        localStorage.setItem(STORAGE_KEYS.LEAGUE_FILTER, x);
        if (leagueSelect) leagueSelect.value = x;
    }

    function sbMs(ts) {
        // ts: ISO string from Supabase
        var d = ts ? new Date(ts) : null;
        return d && !isNaN(d.getTime()) ? d.getTime() : Date.now();
    }

    function ensureSb() {
        return initSupabase();
    }

    async function dbListNotices() {
        if (!isSupabaseReady()) return getNotices();
        var client = ensureSb();
        var res = await client.from('notices').select('*').order('notice_date', { ascending: false }).order('created_at', { ascending: false });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            var d = r.notice_date ? new Date(r.notice_date) : null;
            return {
                id: r.id,
                title: r.title,
                content: r.content || '',
                date: d ? formatNoticeDate(d) : '',
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbListCommunityPosts() {
        if (!isSupabaseReady()) return getCommunityPosts();
        var client = ensureSb();
        var res = await client
            .from('community_posts')
            .select('*')
            .order('write_date', { ascending: false })
            .order('write_time', { ascending: false })
            .order('created_at', { ascending: false });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                date: r.write_date || '',
                time: (r.write_time || '').slice(0, 5),
                authorName: r.author_name || '',
                authorPlayerId: r.author_player_id || null,
                authorUserId: r.author_user_id || null,
                title: r.title || '',
                content: r.content || '',
                likeCount: (r.like_count !== undefined && r.like_count !== null) ? parseInt(r.like_count, 10) : 0,
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbListGalleryItems() {
        if (!isSupabaseReady()) return getGalleryItems();
        var client = ensureSb();
        var res = await client
            .from('gallery_items')
            .select('*')
            .order('write_date', { ascending: false })
            .order('write_time', { ascending: false })
            .order('created_at', { ascending: false });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                date: r.write_date || '',
                time: (r.write_time || '').slice(0, 5),
                authorName: r.author_name || '',
                authorPlayerId: r.author_player_id || null,
                authorUserId: r.author_user_id || null,
                shortText: r.short_text || '',
                content: r.content || '',
                imageData: r.image_data || '',
                eventDate: r.event_date || '',
                albumName: (r.album_name != null && r.album_name !== undefined) ? String(r.album_name) : '',
                tags: (r.tags != null && r.tags !== undefined) ? String(r.tags) : '',
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbUpsertGalleryItem(it) {
        if (!it) return;
        if (!isSupabaseReady()) {
            var arr = getGalleryItems();
            var idx = arr.findIndex(function (x) { return x && x.id === it.id; });
            if (idx === -1) arr.unshift(it);
            else arr[idx] = it;
            saveGalleryItems(arr);
            return;
        }
        var client = ensureSb();
        var row = {
            id: it.id,
            write_date: it.date || null,
            write_time: it.time || null,
            author_name: it.authorName || '',
            author_player_id: it.authorPlayerId || null,
            author_user_id: it.authorUserId || null,
            short_text: it.shortText || '',
            content: it.content || '',
            image_data: it.imageData || '',
            event_date: it.eventDate || null,
            album_name: (it.albumName != null && it.albumName !== undefined) ? String(it.albumName) : '',
            tags: (it.tags != null && it.tags !== undefined) ? String(it.tags) : '',
            created_at: new Date(it.createdAt || Date.now()).toISOString()
        };
        var res = await client.from('gallery_items').upsert(row, { onConflict: 'id' });
        if (res.error) throw res.error;
    }

    async function dbDeleteGalleryItem(id) {
        if (!id) return;
        if (!isSupabaseReady()) {
            var arr = getGalleryItems().filter(function (x) { return x && x.id !== id; });
            saveGalleryItems(arr);
            return;
        }
        var client = ensureSb();
        var res = await client.from('gallery_items').delete().eq('id', id);
        if (res.error) throw res.error;
    }

    async function dbUpsertCommunityPost(p) {
        if (!p) return;
        if (!isSupabaseReady()) {
            var arr = getCommunityPosts();
            var idx = arr.findIndex(function (x) { return x && x.id === p.id; });
            if (idx === -1) arr.unshift(p);
            else arr[idx] = p;
            saveCommunityPosts(arr);
            return;
        }
        var client = ensureSb();
        var row = {
            id: p.id,
            write_date: p.date || null,
            write_time: p.time || null,
            author_name: p.authorName || '',
            author_player_id: p.authorPlayerId || null,
            author_user_id: p.authorUserId || null,
            title: p.title || '',
            content: p.content || '',
            created_at: new Date(p.createdAt || Date.now()).toISOString()
        };
        var res = await client.from('community_posts').upsert(row, { onConflict: 'id' });
        if (res.error) throw res.error;
    }

    async function dbUpsertNotice(n) {
        if (!isSupabaseReady()) {
            var notices = getNotices();
            var idx = notices.findIndex(function (x) { return x.id === n.id; });
            if (idx === -1) notices.unshift(n);
            else notices[idx] = n;
            saveNotices(notices);
            return;
        }
        var client = ensureSb();
        var d = parseNoticeDate(n.date);
        var row = {
            id: n.id,
            title: n.title,
            content: n.content || '',
            notice_date: d ? d.toISOString().slice(0, 10) : null,
            created_at: new Date(n.createdAt || Date.now()).toISOString()
        };
        var res = await client.from('notices').upsert(row, { onConflict: 'id' });
        if (res.error) throw res.error;
    }

    async function dbListSchedules() {
        if (!isSupabaseReady()) return getSchedules();
        var client = ensureSb();
        var res = await client.from('schedules').select('*').order('game_date', { ascending: true }).order('game_time', { ascending: true });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            var d = r.game_date ? new Date(r.game_date) : null;
            return {
                id: r.id,
                leagueId: r.league_id || 'nono',
                date: d ? toInputDate(d) : '',
                time: r.game_time || '13:00',
                opponent: r.opponent || '',
                location: r.location || '',
                status: r.status || '예정',
                batOrder: r.bat_order || '선공',
                result: r.result || '',
                ourScore: r.our_score === null || r.our_score === undefined ? '' : String(r.our_score),
                opponentScore: r.opponent_score === null || r.opponent_score === undefined ? '' : String(r.opponent_score),
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbUpsertSchedule(s) {
        if (!isSupabaseReady()) {
            var schedules = getSchedules();
            var idx = schedules.findIndex(function (x) { return x.id === s.id; });
            if (idx === -1) schedules.unshift(s);
            else schedules[idx] = s;
            saveSchedules(schedules);
            return;
        }
        var client = ensureSb();
        var row = {
            id: s.id,
            league_id: normalizeLeagueId(s.leagueId || 'nono'),
            game_date: s.date || null,
            game_time: s.time || '',
            opponent: s.opponent || '',
            location: s.location || '',
            status: s.status || '예정',
            bat_order: s.batOrder || '선공',
            result: s.result || '',
            our_score: s.ourScore === '' ? null : (s.ourScore === undefined ? null : parseInt(String(s.ourScore), 10)),
            opponent_score: s.opponentScore === '' ? null : (s.opponentScore === undefined ? null : parseInt(String(s.opponentScore), 10)),
            created_at: new Date(s.createdAt || Date.now()).toISOString()
        };
        var res = await client.from('schedules').upsert(row, { onConflict: 'id' });
        if (res.error) throw res.error;
    }

    async function dbListMedia() {
        if (!isSupabaseReady()) return getMedia();
        var client = ensureSb();
        var res = await client.from('media').select('*').order('created_at', { ascending: false });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                type: r.media_type,
                title: r.title,
                url: r.url,
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbUpsertMedia(m) {
        if (!isSupabaseReady()) {
            var arr = getMedia();
            var idx = arr.findIndex(function (x) { return x.id === m.id; });
            if (idx === -1) arr.unshift(m);
            else arr[idx] = m;
            saveMedia(arr);
            return;
        }
        var client = ensureSb();
        var row = {
            id: m.id,
            media_type: m.type,
            title: m.title,
            url: m.url,
            created_at: new Date(m.createdAt || Date.now()).toISOString()
        };
        var res = await client.from('media').upsert(row, { onConflict: 'id' });
        if (res.error) throw res.error;
    }

    async function dbListPlayers() {
        if (!isSupabaseReady()) return getPlayers();
        var client = ensureSb();
        var res = await client.from('players').select('*').order('jersey_no', { ascending: true });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                jerseyNo: r.jersey_no,
                name: r.name,
                role: r.role || '4',
                primaryPos: r.primary_pos || '',
                secondaryPos: r.secondary_pos || '',
                status: r.status || '활동',
                contact: r.contact || '',
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbUpsertPlayer(p) {
        if (!isSupabaseReady()) {
            var players = getPlayers();
            var idx = players.findIndex(function (x) { return x.id === p.id; });
            if (idx === -1) players.unshift(p);
            else players[idx] = p;
            savePlayers(players);
            return;
        }
        var client = ensureSb();
        var row = {
            id: p.id,
            jersey_no: String(p.jerseyNo != null && p.jerseyNo !== '' ? p.jerseyNo : '').trim(),
            name: p.name || '',
            role: p.role || '4',
            primary_pos: p.primaryPos || '',
            secondary_pos: p.secondaryPos || '',
            status: p.status || '활동',
            contact: p.contact || '',
            created_at: new Date(p.createdAt || Date.now()).toISOString()
        };
        var res = await client.from('players').upsert(row, { onConflict: 'id' });
        if (res.error) throw res.error;
    }

    async function dbListPersonalRecords() {
        if (!isSupabaseReady()) return getPersonalRecords();
        var client = ensureSb();
        var res = await client.from('personal_records').select('*');
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                leagueId: r.league_id || 'nono',
                playerId: r.player_id,
                pa: r.pa,
                ab: r.ab,
                h: r.h,
                rbi: r.rbi,
                r: r.r,
                bb: r.bb,
                so: r.so,
                sb: r.sb,
                avg: (r.avg !== null && r.avg !== undefined) ? String(r.avg).padStart(5, '0') : '0.000',
                updatedAt: r.updated_at ? sbMs(r.updated_at) : Date.now()
            };
        });
    }

    async function dbUpsertPersonalRecord(rec) {
        if (!isSupabaseReady()) {
            upsertPersonalRecord(rec.leagueId, rec.playerId, rec);
            return;
        }
        var client = ensureSb();
        var row = {
            league_id: normalizeLeagueId(rec.leagueId || 'nono'),
            player_id: rec.playerId,
            pa: toInt(rec.pa),
            ab: toInt(rec.ab),
            h: toInt(rec.h),
            rbi: toInt(rec.rbi),
            r: toInt(rec.r),
            bb: toInt(rec.bb),
            so: toInt(rec.so),
            sb: toInt(rec.sb),
            avg: parseFloat(String(rec.avg || '0')),
            updated_at: new Date(rec.updatedAt || Date.now()).toISOString()
        };
        var res = await client.from('personal_records').upsert(row, { onConflict: 'league_id,player_id' });
        if (res.error) throw res.error;
    }

    async function dbListGameBattingLines(scheduleId) {
        if (!scheduleId) return [];
        if (!isSupabaseReady()) {
            return (getGameBattingLines() || []).filter(function (r) { return r && r.scheduleId === scheduleId; });
        }
        var client = ensureSb();
        var res = await client.from('game_batting_lines').select('*').eq('schedule_id', scheduleId).order('created_at', { ascending: true });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                scheduleId: r.schedule_id,
                playerId: r.player_id,
                pa: r.pa != null ? r.pa : 0,
                ab: r.ab,
                h: r.h,
                rbi: r.rbi,
                r: r.r,
                bb: r.bb != null ? r.bb : 0,
                so: r.so != null ? r.so : 0,
                sb: r.sb,
                battingOrder: r.batting_order != null ? r.batting_order : null,
                inning_1: r.inning_1 || '',
                inning_2: r.inning_2 || '',
                inning_3: r.inning_3 || '',
                inning_4: r.inning_4 || '',
                inning_5: r.inning_5 || '',
                inning_6: r.inning_6 || '',
                inning_7: r.inning_7 || '',
                inning_8: r.inning_8 || '',
                inning_9: r.inning_9 || '',
                season_avg: r.season_avg != null ? parseFloat(String(r.season_avg)) : null,
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbListGamePitchingLines(scheduleId) {
        if (!scheduleId) return [];
        if (!isSupabaseReady()) {
            return (getGamePitchingLines() || []).filter(function (r) { return r && r.scheduleId === scheduleId; });
        }
        var client = ensureSb();
        var res = await client.from('game_pitching_lines').select('*').eq('schedule_id', scheduleId).order('created_at', { ascending: true });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                scheduleId: r.schedule_id,
                playerId: r.player_id,
                ip: r.ip,
                h: r.h,
                er: r.er,
                w: r.w,
                l: r.l,
                sv: r.sv,
                result: r.result || '',
                bf: r.bf != null ? r.bf : 0,
                ab: r.ab != null ? r.ab : 0,
                hr: r.hr != null ? r.hr : 0,
                sh: r.sh != null ? r.sh : 0,
                sf: r.sf != null ? r.sf : 0,
                bb: r.bb != null ? r.bb : 0,
                hbp: r.hbp != null ? r.hbp : 0,
                so: r.so != null ? r.so : 0,
                wp: r.wp != null ? r.wp : 0,
                balk: r.balk != null ? r.balk : 0,
                r: r.r != null ? r.r : 0,
                np: r.np != null ? r.np : 0,
                season_era: r.season_era != null ? parseFloat(String(r.season_era)) : null,
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbListGameBattingLinesByScheduleIds(scheduleIds) {
        var ids = (scheduleIds || []).filter(Boolean);
        if (!ids.length) return [];
        if (!isSupabaseReady()) {
            return (getGameBattingLines() || []).filter(function (r) { return r && ids.indexOf(r.scheduleId) !== -1; });
        }
        var client = ensureSb();
        var res = await client.from('game_batting_lines').select('*').in('schedule_id', ids);
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                scheduleId: r.schedule_id,
                playerId: r.player_id,
                pa: r.pa != null ? r.pa : 0,
                ab: r.ab,
                h: r.h,
                rbi: r.rbi,
                r: r.r,
                bb: r.bb != null ? r.bb : 0,
                so: r.so != null ? r.so : 0,
                sb: r.sb,
                battingOrder: r.batting_order != null ? r.batting_order : null,
                updatedAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbListGamePitchingLinesByScheduleIds(scheduleIds) {
        var ids = (scheduleIds || []).filter(Boolean);
        if (!ids.length) return [];
        if (!isSupabaseReady()) {
            return (getGamePitchingLines() || []).filter(function (r) { return r && ids.indexOf(r.scheduleId) !== -1; });
        }
        var client = ensureSb();
        var res = await client.from('game_pitching_lines').select('*').in('schedule_id', ids);
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                scheduleId: r.schedule_id,
                playerId: r.player_id,
                ip: r.ip,
                h: r.h,
                er: r.er,
                w: r.w,
                l: r.l,
                sv: r.sv,
                updatedAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function dbReplaceGameBattingLines(scheduleId, lines) {
        if (!scheduleId) return;
        if (!isSupabaseReady()) {
            var all = (getGameBattingLines() || []).filter(function (r) { return r && r.scheduleId !== scheduleId; });
            (lines || []).forEach(function (ln) {
                all.push({
                    id: ln.id || 'gbl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                    scheduleId: scheduleId,
                    playerId: ln.playerId,
                    pa: toInt(ln.pa),
                    ab: toInt(ln.ab),
                    h: toInt(ln.h),
                    rbi: toInt(ln.rbi),
                    r: toInt(ln.r),
                    bb: toInt(ln.bb),
                    so: toInt(ln.so),
                    sb: toInt(ln.sb),
                    battingOrder: ln.battingOrder != null && ln.battingOrder !== '' ? parseInt(String(ln.battingOrder), 10) : null,
                    inning_1: ln.inning_1 || '',
                    inning_2: ln.inning_2 || '',
                    inning_3: ln.inning_3 || '',
                    inning_4: ln.inning_4 || '',
                    inning_5: ln.inning_5 || '',
                    inning_6: ln.inning_6 || '',
                    inning_7: ln.inning_7 || '',
                    inning_8: ln.inning_8 || '',
                    inning_9: ln.inning_9 || '',
                    season_avg: ln.season_avg != null && ln.season_avg !== '' ? parseFloat(String(ln.season_avg)) : null,
                    createdAt: Date.now()
                });
            });
            saveGameBattingLines(all);
            return;
        }
        var client = ensureSb();
        var resDel = await client.from('game_batting_lines').delete().eq('schedule_id', scheduleId);
        if (resDel.error) throw resDel.error;
        if (!lines || !lines.length) return;
        var rows = lines.map(function (ln) {
            return {
                id: ln.id || 'gbl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                schedule_id: scheduleId,
                player_id: ln.playerId,
                pa: toInt(ln.pa),
                ab: toInt(ln.ab),
                h: toInt(ln.h),
                rbi: toInt(ln.rbi),
                r: toInt(ln.r),
                bb: toInt(ln.bb),
                so: toInt(ln.so),
                sb: toInt(ln.sb),
                batting_order: ln.battingOrder != null && ln.battingOrder !== '' ? parseInt(String(ln.battingOrder), 10) : null,
                inning_1: (ln.inning_1 || '').trim(),
                inning_2: (ln.inning_2 || '').trim(),
                inning_3: (ln.inning_3 || '').trim(),
                inning_4: (ln.inning_4 || '').trim(),
                inning_5: (ln.inning_5 || '').trim(),
                inning_6: (ln.inning_6 || '').trim(),
                inning_7: (ln.inning_7 || '').trim(),
                inning_8: (ln.inning_8 || '').trim(),
                inning_9: (ln.inning_9 || '').trim(),
                season_avg: ln.season_avg != null && ln.season_avg !== '' ? parseFloat(String(ln.season_avg)) : null,
                created_at: new Date(ln.createdAt || Date.now()).toISOString()
            };
        });
        var resIns = await client.from('game_batting_lines').insert(rows);
        if (resIns.error) throw resIns.error;
    }

    async function dbReplaceGamePitchingLines(scheduleId, lines) {
        if (!scheduleId) return;
        if (!isSupabaseReady()) {
            var all = (getGamePitchingLines() || []).filter(function (r) { return r && r.scheduleId !== scheduleId; });
            (lines || []).forEach(function (ln) {
                all.push({
                    id: ln.id || 'gpl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                    scheduleId: scheduleId,
                    playerId: ln.playerId,
                    ip: parseFloat(String(ln.ip || '0')) || 0,
                    h: toInt(ln.h),
                    er: toInt(ln.er),
                    w: toInt(ln.w),
                    l: toInt(ln.l),
                    sv: toInt(ln.sv),
                    result: ln.result || '',
                    bf: toInt(ln.bf),
                    ab: toInt(ln.ab),
                    hr: toInt(ln.hr),
                    sh: toInt(ln.sh),
                    sf: toInt(ln.sf),
                    bb: toInt(ln.bb),
                    hbp: toInt(ln.hbp),
                    so: toInt(ln.so),
                    wp: toInt(ln.wp),
                    balk: toInt(ln.balk),
                    r: toInt(ln.r),
                    np: toInt(ln.np),
                    season_era: ln.season_era != null && ln.season_era !== '' ? parseFloat(String(ln.season_era)) : null,
                    createdAt: Date.now()
                });
            });
            saveGamePitchingLines(all);
            return;
        }
        var client = ensureSb();
        var resDel = await client.from('game_pitching_lines').delete().eq('schedule_id', scheduleId);
        if (resDel.error) throw resDel.error;
        if (!lines || !lines.length) return;
        var rows = lines.map(function (ln) {
            return {
                id: ln.id || 'gpl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                schedule_id: scheduleId,
                player_id: ln.playerId,
                ip: parseFloat(String(ln.ip || '0')) || 0,
                h: toInt(ln.h),
                er: toInt(ln.er),
                w: toInt(ln.w),
                l: toInt(ln.l),
                sv: toInt(ln.sv),
                result: (ln.result || '').trim(),
                bf: toInt(ln.bf),
                ab: toInt(ln.ab),
                hr: toInt(ln.hr),
                sh: toInt(ln.sh),
                sf: toInt(ln.sf),
                bb: toInt(ln.bb),
                hbp: toInt(ln.hbp),
                so: toInt(ln.so),
                wp: toInt(ln.wp),
                balk: toInt(ln.balk),
                r: toInt(ln.r),
                np: toInt(ln.np),
                season_era: ln.season_era != null && ln.season_era !== '' ? parseFloat(String(ln.season_era)) : null,
                created_at: new Date(ln.createdAt || Date.now()).toISOString()
            };
        });
        var resIns = await client.from('game_pitching_lines').insert(rows);
        if (resIns.error) throw resIns.error;
    }

    async function dbListGameOpponentBattingLines(scheduleId) {
        if (!scheduleId) return [];
        if (!isSupabaseReady()) {
            return (getGameOpponentBattingLines() || []).filter(function (r) { return r && r.scheduleId === scheduleId; });
        }
        var client = ensureSb();
        var res = await client.from('game_opponent_batting_lines').select('*').eq('schedule_id', scheduleId).order('created_at', { ascending: true });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                scheduleId: r.schedule_id,
                playerName: r.player_name || '',
                ab: r.ab,
                h: r.h,
                rbi: r.rbi,
                r: r.r,
                sb: r.sb,
                battingOrder: r.batting_order != null ? r.batting_order : null,
                inning_1: r.inning_1 || '',
                inning_2: r.inning_2 || '',
                inning_3: r.inning_3 || '',
                inning_4: r.inning_4 || '',
                inning_5: r.inning_5 || '',
                inning_6: r.inning_6 || '',
                inning_7: r.inning_7 || '',
                inning_8: r.inning_8 || '',
                inning_9: r.inning_9 || '',
                season_avg: r.season_avg != null ? parseFloat(String(r.season_avg)) : null
            };
        });
    }

    async function dbReplaceGameOpponentBattingLines(scheduleId, lines) {
        if (!scheduleId) return;
        if (!isSupabaseReady()) {
            var all = (getGameOpponentBattingLines() || []).filter(function (r) { return r && r.scheduleId !== scheduleId; });
            (lines || []).forEach(function (ln) {
                all.push({
                    id: ln.id || 'gobl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                    scheduleId: scheduleId,
                    playerName: (ln.playerName || '').trim(),
                    ab: toInt(ln.ab),
                    h: toInt(ln.h),
                    rbi: toInt(ln.rbi),
                    r: toInt(ln.r),
                    sb: toInt(ln.sb),
                    battingOrder: ln.battingOrder != null && ln.battingOrder !== '' ? parseInt(String(ln.battingOrder), 10) : null,
                    inning_1: ln.inning_1 || '',
                    inning_2: ln.inning_2 || '',
                    inning_3: ln.inning_3 || '',
                    inning_4: ln.inning_4 || '',
                    inning_5: ln.inning_5 || '',
                    inning_6: ln.inning_6 || '',
                    inning_7: ln.inning_7 || '',
                    inning_8: ln.inning_8 || '',
                    inning_9: ln.inning_9 || '',
                    season_avg: ln.season_avg != null && ln.season_avg !== '' ? parseFloat(String(ln.season_avg)) : null
                });
            });
            saveGameOpponentBattingLines(all);
            return;
        }
        var client = ensureSb();
        var resDel = await client.from('game_opponent_batting_lines').delete().eq('schedule_id', scheduleId);
        if (resDel.error) throw resDel.error;
        if (!lines || !lines.length) return;
        var rows = lines.map(function (ln) {
            return {
                id: ln.id || 'gobl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                schedule_id: scheduleId,
                player_name: (ln.playerName || '').trim(),
                pa: toInt(ln.pa),
                ab: toInt(ln.ab),
                h: toInt(ln.h),
                rbi: toInt(ln.rbi),
                r: toInt(ln.r),
                bb: toInt(ln.bb),
                so: toInt(ln.so),
                sb: toInt(ln.sb),
                batting_order: ln.battingOrder != null && ln.battingOrder !== '' ? parseInt(String(ln.battingOrder), 10) : null,
                inning_1: (ln.inning_1 || '').trim(),
                inning_2: (ln.inning_2 || '').trim(),
                inning_3: (ln.inning_3 || '').trim(),
                inning_4: (ln.inning_4 || '').trim(),
                inning_5: (ln.inning_5 || '').trim(),
                inning_6: (ln.inning_6 || '').trim(),
                inning_7: (ln.inning_7 || '').trim(),
                inning_8: (ln.inning_8 || '').trim(),
                inning_9: (ln.inning_9 || '').trim(),
                season_avg: ln.season_avg != null && ln.season_avg !== '' ? parseFloat(String(ln.season_avg)) : null,
                created_at: new Date().toISOString()
            };
        });
        var resIns = await client.from('game_opponent_batting_lines').insert(rows);
        if (resIns.error) throw resIns.error;
    }

    async function dbListGameOpponentPitchingLines(scheduleId) {
        if (!scheduleId) return [];
        if (!isSupabaseReady()) {
            return (getGameOpponentPitchingLines() || []).filter(function (r) { return r && r.scheduleId === scheduleId; });
        }
        var client = ensureSb();
        var res = await client.from('game_opponent_pitching_lines').select('*').eq('schedule_id', scheduleId).order('created_at', { ascending: true });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                scheduleId: r.schedule_id,
                playerName: r.player_name || '',
                ip: r.ip,
                h: r.h,
                er: r.er,
                w: r.w,
                l: r.l,
                sv: r.sv,
                result: r.result || '',
                bf: r.bf != null ? r.bf : 0,
                ab: r.ab != null ? r.ab : 0,
                hr: r.hr != null ? r.hr : 0,
                sh: r.sh != null ? r.sh : 0,
                sf: r.sf != null ? r.sf : 0,
                bb: r.bb != null ? r.bb : 0,
                hbp: r.hbp != null ? r.hbp : 0,
                so: r.so != null ? r.so : 0,
                wp: r.wp != null ? r.wp : 0,
                balk: r.balk != null ? r.balk : 0,
                r: r.r != null ? r.r : 0,
                np: r.np != null ? r.np : 0,
                season_era: r.season_era != null ? parseFloat(String(r.season_era)) : null
            };
        });
    }

    async function dbReplaceGameOpponentPitchingLines(scheduleId, lines) {
        if (!scheduleId) return;
        if (!isSupabaseReady()) {
            var all = (getGameOpponentPitchingLines() || []).filter(function (r) { return r && r.scheduleId !== scheduleId; });
            (lines || []).forEach(function (ln) {
                all.push({
                    id: ln.id || 'gopl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                    scheduleId: scheduleId,
                    playerName: (ln.playerName || '').trim(),
                    ip: parseFloat(String(ln.ip || '0')) || 0,
                    h: toInt(ln.h),
                    er: toInt(ln.er),
                    w: toInt(ln.w),
                    l: toInt(ln.l),
                    sv: toInt(ln.sv),
                    result: ln.result || '',
                    bf: toInt(ln.bf),
                    ab: toInt(ln.ab),
                    hr: toInt(ln.hr),
                    sh: toInt(ln.sh),
                    sf: toInt(ln.sf),
                    bb: toInt(ln.bb),
                    hbp: toInt(ln.hbp),
                    so: toInt(ln.so),
                    wp: toInt(ln.wp),
                    balk: toInt(ln.balk),
                    r: toInt(ln.r),
                    np: toInt(ln.np),
                    season_era: ln.season_era != null && ln.season_era !== '' ? parseFloat(String(ln.season_era)) : null
                });
            });
            saveGameOpponentPitchingLines(all);
            return;
        }
        var client = ensureSb();
        var resDel = await client.from('game_opponent_pitching_lines').delete().eq('schedule_id', scheduleId);
        if (resDel.error) throw resDel.error;
        if (!lines || !lines.length) return;
        var rows = lines.map(function (ln) {
            return {
                id: ln.id || 'gopl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
                schedule_id: scheduleId,
                player_name: (ln.playerName || '').trim(),
                ip: parseFloat(String(ln.ip || '0')) || 0,
                h: toInt(ln.h),
                er: toInt(ln.er),
                w: toInt(ln.w),
                l: toInt(ln.l),
                sv: toInt(ln.sv),
                result: (ln.result || '').trim(),
                bf: toInt(ln.bf),
                ab: toInt(ln.ab),
                hr: toInt(ln.hr),
                sh: toInt(ln.sh),
                sf: toInt(ln.sf),
                bb: toInt(ln.bb),
                hbp: toInt(ln.hbp),
                so: toInt(ln.so),
                wp: toInt(ln.wp),
                balk: toInt(ln.balk),
                r: toInt(ln.r),
                np: toInt(ln.np),
                season_era: ln.season_era != null && ln.season_era !== '' ? parseFloat(String(ln.season_era)) : null,
                created_at: new Date().toISOString()
            };
        });
        var resIns = await client.from('game_opponent_pitching_lines').insert(rows);
        if (resIns.error) throw resIns.error;
    }

    async function dbDeleteNotice(id) {
        if (!id) return;
        if (!isSupabaseReady()) {
            var arr = getNotices();
            arr = arr.filter(function (x) { return x && x.id !== id; });
            saveNotices(arr);
            return;
        }
        var client = ensureSb();
        var res = await client.from('notices').delete().eq('id', id);
        if (res.error) throw res.error;
    }

    async function dbDeleteCommunityPost(id) {
        if (!id) return;
        if (!isSupabaseReady()) {
            var arr = getCommunityPosts().filter(function (x) { return x && x.id !== id; });
            saveCommunityPosts(arr);
            return;
        }
        var client = ensureSb();
        var res = await client.from('community_posts').delete().eq('id', id);
        if (res.error) throw res.error;
    }

    async function dbListCommunityComments(postId) {
        if (!postId) return [];
        if (!isSupabaseReady()) {
            return getCommunityComments()
                .filter(function (c) { return c && c.postId === postId; })
                .sort(function (a, b) { return (a.createdAt || 0) - (b.createdAt || 0); });
        }
        var client = ensureSb();
        var res = await client.from('community_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                id: r.id,
                postId: r.post_id,
                authorName: r.author_name || '',
                authorPlayerId: r.author_player_id || null,
                authorUserId: r.author_user_id || null,
                content: r.content || '',
                createdAt: r.created_at ? sbMs(r.created_at) : Date.now()
            };
        });
    }

    async function getCommunityCommentCountMap(postIds) {
        var ids = Array.isArray(postIds) ? postIds.map(String).filter(Boolean) : [];
        var map = {};
        ids.forEach(function (id) { map[id] = 0; });
        if (ids.length === 0) return map;

        // localStorage
        if (!isSupabaseReady()) {
            var set = {};
            ids.forEach(function (id) { set[id] = true; });
            getCommunityComments().forEach(function (c) {
                if (!c || !c.postId) return;
                var pid = String(c.postId);
                if (!set[pid]) return;
                map[pid] = (map[pid] || 0) + 1;
            });
            return map;
        }

        // Supabase: fetch only post_id for these posts (chunk to avoid too-long IN)
        var client = ensureSb();
        var chunkSize = 200;
        for (var i = 0; i < ids.length; i += chunkSize) {
            var chunk = ids.slice(i, i + chunkSize);
            var res = await client.from('community_comments').select('post_id').in('post_id', chunk);
            if (res.error) throw res.error;
            (res.data || []).forEach(function (r) {
                var pid = r && r.post_id ? String(r.post_id) : '';
                if (!pid) return;
                map[pid] = (map[pid] || 0) + 1;
            });
        }
        return map;
    }

    async function dbInsertCommunityComment(c) {
        if (!c) return;
        if (!isSupabaseReady()) {
            var arr = getCommunityComments();
            arr.push(c);
            saveCommunityComments(arr);
            return;
        }
        var client = ensureSb();
        var row = {
            id: c.id,
            post_id: c.postId,
            author_name: c.authorName || '',
            author_player_id: c.authorPlayerId || null,
            author_user_id: c.authorUserId || null,
            content: c.content || '',
            created_at: new Date(c.createdAt || Date.now()).toISOString()
        };
        var res = await client.from('community_comments').insert(row);
        if (res.error) throw res.error;
    }

    async function dbDeleteCommunityComment(id) {
        if (!id) return;
        if (!isSupabaseReady()) {
            var arr = getCommunityComments().filter(function (c) { return c && c.id !== id; });
            saveCommunityComments(arr);
            return;
        }
        var client = ensureSb();
        var res = await client.from('community_comments').delete().eq('id', id);
        if (res.error) throw res.error;
    }

    async function dbDeleteSchedule(id) {
        if (!id) return;
        if (!isSupabaseReady()) {
            var arr = getSchedules();
            arr = arr.filter(function (x) { return x && x.id !== id; });
            saveSchedules(arr);
            return;
        }
        var client = ensureSb();
        var res = await client.from('schedules').delete().eq('id', id);
        if (res.error) throw res.error;
    }

    async function dbDeleteMedia(id) {
        if (!id) return;
        if (!isSupabaseReady()) {
            var arr = getMedia();
            arr = arr.filter(function (x) { return x && x.id !== id; });
            saveMedia(arr);
            return;
        }
        var client = ensureSb();
        var res = await client.from('media').delete().eq('id', id);
        if (res.error) throw res.error;
    }

    async function dbDeletePlayer(id) {
        if (!id) return;
        if (!isSupabaseReady()) {
            var players = getPlayers().filter(function (x) { return x && x.id !== id; });
            savePlayers(players);
            var recs = getPersonalRecords().filter(function (r) { return r && r.playerId !== id; });
            savePersonalRecords(recs);
            var pitchRecs = getPitcherRecords().filter(function (r) { return r && r.playerId !== id; });
            savePitcherRecords(pitchRecs);
            return;
        }
        var client = ensureSb();
        // personal_records, pitcher_records는 FK(on delete cascade)로 같이 삭제됨
        var res = await client.from('players').delete().eq('id', id);
        if (res.error) throw res.error;
    }

    async function dbDeletePersonalRecord(leagueId, playerId) {
        if (!playerId) return;
        if (!isSupabaseReady()) {
            leagueId = normalizeLeagueId(leagueId || 'nono');
            var recs = getPersonalRecords().filter(function (r) {
                if (!r) return false;
                var lid = normalizeLeagueId(r.leagueId || 'nono');
                return !(String(r.playerId) === String(playerId) && lid === leagueId);
            });
            savePersonalRecords(recs);
            return;
        }
        var client = ensureSb();
        var res = await client.from('personal_records').delete().eq('player_id', playerId).eq('league_id', normalizeLeagueId(leagueId || 'nono'));
        if (res.error) throw res.error;
    }

    async function dbDeletePersonalRecordsByLeague(leagueId) {
        var lid = normalizeLeagueId(leagueId || 'nono');
        if (!isSupabaseReady()) {
            var recs = (getPersonalRecords() || []).filter(function (r) {
                return normalizeLeagueId((r && r.leagueId) || 'nono') !== lid;
            });
            savePersonalRecords(recs);
            return;
        }
        var client = ensureSb();
        var res = await client.from('personal_records').delete().eq('league_id', lid);
        if (res.error) throw res.error;
    }

    async function dbListPitcherRecords() {
        if (!isSupabaseReady()) return getPitcherRecords();
        var client = ensureSb();
        var res = await client.from('pitcher_records').select('*').order('league_id').order('updated_at', { ascending: false });
        if (res.error) throw res.error;
        return (res.data || []).map(function (r) {
            return {
                leagueId: r.league_id || 'nono',
                playerId: r.player_id,
                ip: parseFloat(String(r.ip || 0)),
                h: toInt(r.h),
                er: toInt(r.er),
                w: toInt(r.w),
                l: toInt(r.l),
                sv: toInt(r.sv),
                updatedAt: r.updated_at ? sbMs(r.updated_at) : Date.now()
            };
        });
    }

    async function dbUpsertPitcherRecord(rec) {
        if (!rec) return;
        if (!isSupabaseReady()) {
            upsertPitcherRecord(rec.leagueId, rec.playerId, rec);
            return;
        }
        var client = ensureSb();
        var row = {
            league_id: normalizeLeagueId(rec.leagueId || 'nono'),
            player_id: rec.playerId,
            ip: parseFloat(String(rec.ip || 0)),
            h: toInt(rec.h),
            er: toInt(rec.er),
            w: toInt(rec.w),
            l: toInt(rec.l),
            sv: toInt(rec.sv),
            updated_at: new Date(rec.updatedAt || Date.now()).toISOString()
        };
        var res = await client.from('pitcher_records').upsert(row, { onConflict: 'league_id,player_id' });
        if (res.error) throw res.error;
    }

    async function dbDeletePitcherRecord(leagueId, playerId) {
        if (!playerId) return;
        if (!isSupabaseReady()) {
            var arr = getPitcherRecords().filter(function (r) {
                if (!r) return false;
                return !(String(r.playerId) === String(playerId) && normalizeLeagueId(r.leagueId || 'nono') === normalizeLeagueId(leagueId || 'nono'));
            });
            savePitcherRecords(arr);
            return;
        }
        var client = ensureSb();
        var res = await client.from('pitcher_records').delete().eq('player_id', playerId).eq('league_id', normalizeLeagueId(leagueId || 'nono'));
        if (res.error) throw res.error;
    }

    async function dbDeletePitcherRecordsByLeague(leagueId) {
        var lid = normalizeLeagueId(leagueId || 'nono');
        if (!isSupabaseReady()) {
            var recs = (getPitcherRecords() || []).filter(function (r) {
                return normalizeLeagueId((r && r.leagueId) || 'nono') !== lid;
            });
            savePitcherRecords(recs);
            return;
        }
        var client = ensureSb();
        var res = await client.from('pitcher_records').delete().eq('league_id', lid);
        if (res.error) throw res.error;
    }

    async function dbDeleteTeamContentKey(key) {
        if (!key) return;
        if (!isSupabaseReady()) {
            if (key === 'story') localStorage.setItem(STORAGE_KEYS.TEAM_STORY, '');
            else if (key === 'values') localStorage.setItem(STORAGE_KEYS.TEAM_VALUES, '');
            else if (key === 'history') localStorage.setItem(STORAGE_KEYS.TEAM_HISTORY, '');
            return;
        }
        var client = ensureSb();
        var res = await client.from('team_content').delete().eq('content_key', key);
        if (res.error) throw res.error;
    }

    async function dbGetTeamContent(key, fallbackKey) {
        if (!isSupabaseReady()) return localStorage.getItem(fallbackKey) || '';
        var client = ensureSb();
        var res = await client.from('team_content').select('*').eq('content_key', key).maybeSingle();
        if (res.error && res.status !== 406) throw res.error;
        return res.data ? (res.data.content_value || '') : '';
    }

    async function dbSetTeamContent(key, value) {
        if (!isSupabaseReady()) {
            if (key === 'story') localStorage.setItem(STORAGE_KEYS.TEAM_STORY, value || '');
            else if (key === 'values') localStorage.setItem(STORAGE_KEYS.TEAM_VALUES, value || '');
            else if (key === 'history') localStorage.setItem(STORAGE_KEYS.TEAM_HISTORY, value || '');
            return;
        }
        var client = ensureSb();
        var row = { content_key: key, content_value: value || '', updated_at: new Date().toISOString() };
        var res = await client.from('team_content').upsert(row, { onConflict: 'content_key' });
        if (res.error) throw res.error;
    }

    // =========================
    // DB-first read helpers (Supabase 모드에서는 항상 DB에서 조회)
    // =========================
    var DB_CACHE = {
        notices: null,
        schedules: null,
        media: null,
        players: null,
        personal: null,
        pitcher: null,
        community: null,
        gallery: null,
        team: { story: null, values: null, history: null }
    };

    function isDbMode() {
        return isSupabaseReady();
    }

    function canDbReadNow() {
        // RLS 때문에 Supabase 모드에서는 "인증 후"에만 읽기 가능
        return isDbMode() && isLoggedIn();
    }

    function invalidateDbCache(keys) {
        if (!keys || !keys.length) {
            DB_CACHE.notices = null;
            DB_CACHE.schedules = null;
            DB_CACHE.media = null;
            DB_CACHE.players = null;
            DB_CACHE.personal = null;
            DB_CACHE.pitcher = null;
            DB_CACHE.community = null;
            DB_CACHE.gallery = null;
            DB_CACHE.team.story = null;
            DB_CACHE.team.values = null;
            DB_CACHE.team.history = null;
            return;
        }
        keys.forEach(function (k) {
            if (k === 'notices') DB_CACHE.notices = null;
            else if (k === 'schedules') DB_CACHE.schedules = null;
            else if (k === 'media') DB_CACHE.media = null;
            else if (k === 'players') DB_CACHE.players = null;
            else if (k === 'personal') DB_CACHE.personal = null;
            else if (k === 'pitcher') DB_CACHE.pitcher = null;
            else if (k === 'community') DB_CACHE.community = null;
            else if (k === 'gallery') DB_CACHE.gallery = null;
            else if (k === 'team_story') DB_CACHE.team.story = null;
            else if (k === 'team_values') DB_CACHE.team.values = null;
            else if (k === 'team_history') DB_CACHE.team.history = null;
        });
    }

    async function fetchNotices(force) {
        if (!isDbMode()) return getNotices();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.notices)) return DB_CACHE.notices;
        var list = await dbListNotices();
        DB_CACHE.notices = list;
        return list;
    }

    async function fetchCommunityPosts(force) {
        if (!isDbMode()) return getCommunityPosts();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.community)) return DB_CACHE.community;
        var list = await dbListCommunityPosts();
        DB_CACHE.community = list;
        return list;
    }

    async function fetchGalleryItems(force) {
        if (!isDbMode()) return getGalleryItems();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.gallery)) return DB_CACHE.gallery;
        var list = await dbListGalleryItems();
        DB_CACHE.gallery = list;
        return list;
    }

    async function fetchSchedules(force) {
        if (!isDbMode()) return getSchedules();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.schedules)) return DB_CACHE.schedules;
        var list = await dbListSchedules();
        DB_CACHE.schedules = list;
        return list;
    }

    async function fetchMedia(force) {
        if (!isDbMode()) return getMedia();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.media)) return DB_CACHE.media;
        var list = await dbListMedia();
        DB_CACHE.media = list;
        return list;
    }

    async function fetchPlayers(force) {
        if (!isDbMode()) return getPlayers();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.players)) return DB_CACHE.players;
        var list = await dbListPlayers();
        DB_CACHE.players = list;
        return list;
    }

    async function fetchPersonalRecords(force) {
        if (!isDbMode()) return getPersonalRecords();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.personal)) return DB_CACHE.personal;
        var list = await dbListPersonalRecords();
        DB_CACHE.personal = list;
        return list;
    }

    async function fetchPitcherRecords(force) {
        if (!isDbMode()) return getPitcherRecords();
        if (!canDbReadNow()) return [];
        if (!force && Array.isArray(DB_CACHE.pitcher)) return DB_CACHE.pitcher;
        var list = await dbListPitcherRecords();
        DB_CACHE.pitcher = list;
        return list;
    }

    async function fetchTeamStory(force) {
        if (!isDbMode()) return getTeamStory();
        if (!canDbReadNow()) return '';
        if (!force && typeof DB_CACHE.team.story === 'string') return DB_CACHE.team.story;
        var v = await dbGetTeamContent('story', STORAGE_KEYS.TEAM_STORY);
        DB_CACHE.team.story = v || '';
        return DB_CACHE.team.story;
    }

    async function fetchTeamValues(force) {
        if (!isDbMode()) return getTeamValues();
        if (!canDbReadNow()) return '';
        if (!force && typeof DB_CACHE.team.values === 'string') return DB_CACHE.team.values;
        var v = await dbGetTeamContent('values', STORAGE_KEYS.TEAM_VALUES);
        DB_CACHE.team.values = v || '';
        return DB_CACHE.team.values;
    }

    async function fetchTeamHistory(force) {
        if (!isDbMode()) return getTeamHistory();
        if (!canDbReadNow()) return '';
        if (!force && typeof DB_CACHE.team.history === 'string') return DB_CACHE.team.history;
        var v = await dbGetTeamContent('history', STORAGE_KEYS.TEAM_HISTORY);
        DB_CACHE.team.history = v || '';
        return DB_CACHE.team.history;
    }

    function getAuth() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || 'null');
        } catch (e) {
            return null;
        }
    }

    function setAuth(v) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(v || null));
    }

    function clearAuth() {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
    }

    function isLoggedIn() {
        var a = getAuth();
        return !!(a && a.loggedIn === true);
    }

    function getCurrentUserRole() {
        // role: 1 감독, 2 코치, 3 총무, 4 선수(기본), 9 관리자
        if (!isLoggedIn()) return '4';
        var a = getAuth();
        if (a && a.role) return String(a.role);
        var pid = a && a.playerId ? String(a.playerId) : '';
        if (!pid) return '4';
        var players = getPlayers();
        var p = players.filter(function (x) { return x && x.id === pid; })[0] || null;
        if (!p) return '4';
        return p.role === undefined || p.role === null || p.role === '' ? '4' : String(p.role);
    }

    function canManage() {
        if (!isLoggedIn()) return false;
        var r = getCurrentUserRole();
        return r === '1' || r === '2' || r === '3' || r === '9';
    }

    function requireManage(e) {
        if (!requireLogin(e)) return false;
        if (canManage()) return true;
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        alert('권한이 없습니다. (감독/코치/총무/관리자만 가능)');
        return false;
    }

    function withManage(handler) {
        return function (e) {
            if (!requireManage(e)) return;
            if (typeof handler === 'function') {
                try {
                    var r = handler(e);
                    if (r && typeof r.then === 'function') {
                        r.catch(function (err) {
                            console.error(err);
                            alert('처리 중 오류가 발생했습니다.');
                        });
                    }
                } catch (err) {
                    console.error(err);
                    alert('처리 중 오류가 발생했습니다.');
                }
            }
        };
    }

    function setDisabled(el, disabled, title) {
        if (!el) return;
        if (disabled) el.setAttribute('disabled', 'disabled');
        else el.removeAttribute('disabled');
        if (title !== undefined) el.setAttribute('title', title);
    }

    function applyPermissionUi() {
        var allowed = canManage();
        var tip = allowed ? '' : '감독/코치/총무/관리자만 가능';
        var loggedIn = isLoggedIn();
        var loginTip = loggedIn ? '' : '로그인 후 가능';

        // 등록/수정/삭제 권한이 필요한 버튼들
        setDisabled(noticeAddBtn, !allowed, tip || '공지 등록');
        setDisabled(scheduleAddBtn, !allowed, tip || '경기 일정 등록');
        setDisabled(seasonScheduleAddBtn, !allowed, tip || '경기 일정·승패 등록');
        setDisabled(personalRecordAddBtn, !allowed, tip || '개인기록 등록');
        setDisabled(pitcherRecordAddBtn, !allowed, tip || '투수기록 등록');
        setDisabled(teamStoryEditBtn, !allowed, tip || '창단 스토리 등록/수정');
        setDisabled(teamValuesEditBtn, !allowed, tip || '팀 가치 등록/수정');
        setDisabled(teamHistoryEditBtn, !allowed, tip || '연혁 등록/수정');
        setDisabled(teamHistoryRowAddBtn, !allowed, tip || '연혁 추가');
        setDisabled(playerAddBtn, !allowed, tip || '선수 등록');
        setDisabled(mediaAddBtn, !allowed, tip || '미디어 등록');
        setDisabled(mediaEditBtn, true, allowed ? '미디어 수정(선택 필요)' : tip);
        setDisabled(noticeListDeleteBtn, !allowed || !selectedNoticeId, allowed ? '선택 공지 삭제' : tip);
        setDisabled(noticeDeleteBtn, !allowed, tip || '공지 삭제');
        setDisabled(scheduleDeleteBtn, !allowed, tip || '경기 삭제');
        setDisabled(playerDeleteBtn, !allowed, tip || '선수 삭제');
        setDisabled(personalRecordDeleteBtn, !allowed, tip || '개인기록 삭제');
        setDisabled(mediaDeleteBtn, !allowed, tip || '미디어 삭제');
        setDisabled(teamStoryDeleteBtn, !allowed, tip || '창단 스토리 삭제');
        setDisabled(teamValuesDeleteBtn, !allowed, tip || '팀 가치 삭제');
        setDisabled(teamHistoryDeleteBtn, !allowed, tip || '연혁 삭제');
        setDisabled(teamHistoryRowDeleteBtn, !allowed, tip || '연혁 항목 삭제');

        // 커뮤니티: 로그인 사용자 글쓰기 허용(권한 제한 없음)
        setDisabled(communityAddBtn, !loggedIn, loginTip || '커뮤니티 글쓰기');

        // 갤러리: 로그인 사용자 등록 허용(권한 제한 없음). 수정/삭제는 모달에서 권한 체크.
        setDisabled(galleryAddBtn, !loggedIn, loginTip || '사진 등록');

        // 선택 상태도 권한에 맞게 초기화
        if (!allowed) clearMediaSelection();
    }

    function getTeamStory() {
        return localStorage.getItem(STORAGE_KEYS.TEAM_STORY) || '';
    }
    function setTeamStory(v) {
        localStorage.setItem(STORAGE_KEYS.TEAM_STORY, v || '');
    }
    function getTeamValues() {
        return localStorage.getItem(STORAGE_KEYS.TEAM_VALUES) || '';
    }
    function setTeamValues(v) {
        localStorage.setItem(STORAGE_KEYS.TEAM_VALUES, v || '');
    }
    function getTeamHistory() {
        return localStorage.getItem(STORAGE_KEYS.TEAM_HISTORY) || '';
    }
    function setTeamHistory(v) {
        localStorage.setItem(STORAGE_KEYS.TEAM_HISTORY, v || '');
    }

    function renderTeamBlock(el, text, emptyMsg) {
        if (!el) return;
        var t = (text || '').trim();
        if (!t) {
            el.textContent = emptyMsg;
            el.classList.add('is-empty');
        } else {
            el.textContent = t;
            el.classList.remove('is-empty');
        }
    }

    function renderTeamHistoryGrid(el, text) {
        if (!el) return;
        var raw = (text || '').trim();
        if (!raw) {
            el.innerHTML = '';
            el.textContent = '등록된 연혁이 없습니다.';
            el.classList.add('is-empty');
            el.classList.remove('history-body');
            return;
        }

        // line -> { year:number|null, content:string, idx:number }
        var rows = raw.split(/\r?\n/).map(function (line, idx) {
            var s = (line || '').trim();
            if (!s) return null;
            var m = s.match(/(\d{4})/);
            var year = null;
            if (m && m[1]) {
                var y = parseInt(m[1], 10);
                if (!isNaN(y)) year = y;
            }
            var content = s;
            if (m && m.index !== undefined) {
                // remove first year token and separators
                content = s.replace(m[1], '').replace(/^[\s\.\-\/:]+/, '').trim();
                if (!content) content = s.trim();
            }
            return { year: year, content: content, idx: idx };
        }).filter(Boolean);

        rows.sort(function (a, b) {
            var ay = a.year === null ? -1 : a.year;
            var by = b.year === null ? -1 : b.year;
            if (ay !== by) return by - ay; // 최근(큰 년도)부터
            return a.idx - b.idx;
        });

        el.classList.remove('is-empty');
        el.classList.add('history-body');
        el.innerHTML = '' +
            '<div class="history-grid-wrap">' +
            '<table class="history-grid">' +
            '<thead><tr><th>년</th><th>내용</th></tr></thead>' +
            '<tbody>' +
            rows.map(function (r) {
                return '<tr>' +
                    '<td class="history-year">' + escapeHtml(r.year === null ? '' : String(r.year)) + '</td>' +
                    '<td class="history-content">' + escapeHtml(r.content || '') + '</td>' +
                    '</tr>';
            }).join('') +
            '</tbody></table></div>';
    }

    function parseTeamHistoryRows(text) {
        var raw = (text || '').trim();
        if (!raw) return [];
        var rows = raw.split(/\r?\n/).map(function (line) {
            var s = (line || '').trim();
            if (!s) return null;
            var m = s.match(/(\d{4})/);
            var year = null;
            if (m && m[1]) {
                var y = parseInt(m[1], 10);
                if (!isNaN(y)) year = y;
            }
            var content = s;
            if (m && m.index !== undefined) {
                content = s.replace(m[1], '').replace(/^[\s\.\-\/:]+/, '').trim();
                if (!content) content = s.trim();
            }
            return { year: year, content: content };
        }).filter(Boolean);
        rows.sort(function (a, b) {
            var ay = a.year === null ? -1 : a.year;
            var by = b.year === null ? -1 : b.year;
            if (ay !== by) return by - ay;
            return String(a.content || '').localeCompare(String(b.content || ''));
        });
        return rows;
    }

    function saveTeamHistoryRows(rows) {
        var cleaned = (rows || []).filter(function (r) { return r && r.year && r.content; });
        cleaned.sort(function (a, b) { return b.year - a.year; });
        var lines = cleaned.map(function (r) { return String(r.year) + ' ' + String(r.content).trim(); });
        setTeamHistory(lines.join('\n'));
    }

    async function renderTeamHistoryFullList() {
        if (!teamHistoryFullBody) return;
        var rows = parseTeamHistoryRows(await fetchTeamHistory(false));
        if (rows.length === 0) {
            teamHistoryFullBody.innerHTML = '<tr><td colspan="2" class="schedule-table-empty">등록된 연혁이 없습니다.</td></tr>';
            return;
        }
        teamHistoryFullBody.innerHTML = rows.map(function (r, idx) {
            return '<tr class="schedule-table-row history-full-row" data-history-idx="' + idx + '" title="더블클릭: 수정">' +
                '<td class="history-year">' + escapeHtml(String(r.year || '')) + '</td>' +
                '<td class="history-content">' + escapeHtml(String(r.content || '')) + '</td>' +
                '</tr>';
        }).join('');
        teamHistoryFullBody.querySelectorAll('.history-full-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var idx = el.getAttribute('data-history-idx');
                if (idx === null || idx === undefined) return;
                return openTeamHistoryRowModal(parseInt(idx, 10));
            }));
        });
    }

    async function openTeamHistoryListModal() {
        await renderTeamHistoryFullList();
        openModal('teamHistoryListModal');
    }

    function closeTeamHistoryListModal() {
        closeModal('teamHistoryListModal');
    }

    async function openTeamHistoryRowModal(idx) {
        var rows = parseTeamHistoryRows(await fetchTeamHistory(false));
        if (idx === null || idx === undefined || isNaN(idx)) {
            editingHistoryRowIndex = null;
            if (teamHistoryRowModalTitle) teamHistoryRowModalTitle.textContent = '연혁 추가';
            if (teamHistoryRowYear) teamHistoryRowYear.value = '';
            if (teamHistoryRowContent) teamHistoryRowContent.value = '';
            if (teamHistoryRowDeleteBtn) teamHistoryRowDeleteBtn.style.display = 'none';
        } else {
            editingHistoryRowIndex = idx;
            var r = rows[idx];
            if (teamHistoryRowModalTitle) teamHistoryRowModalTitle.textContent = '연혁 수정';
            if (teamHistoryRowYear) teamHistoryRowYear.value = r && r.year ? String(r.year) : '';
            if (teamHistoryRowContent) teamHistoryRowContent.value = r ? (r.content || '') : '';
            if (teamHistoryRowDeleteBtn) teamHistoryRowDeleteBtn.style.display = '';
        }
        openModal('teamHistoryRowModal');
        if (teamHistoryRowYear) teamHistoryRowYear.focus();
    }

    function closeTeamHistoryRowModal() {
        editingHistoryRowIndex = null;
        if (teamHistoryRowDeleteBtn) teamHistoryRowDeleteBtn.style.display = 'none';
        closeModal('teamHistoryRowModal');
    }

    async function handleTeamHistoryRowSubmit(e) {
        e.preventDefault();
        var y = teamHistoryRowYear ? parseInt(teamHistoryRowYear.value, 10) : NaN;
        var c = (teamHistoryRowContent && teamHistoryRowContent.value ? teamHistoryRowContent.value : '').trim();
        if (isNaN(y) || y < 1900 || y > 2100) {
            alert('년도(1900~2100)를 입력해 주세요.');
            if (teamHistoryRowYear) teamHistoryRowYear.focus();
            return;
        }
        if (!c) {
            alert('내용을 입력해 주세요.');
            if (teamHistoryRowContent) teamHistoryRowContent.focus();
            return;
        }
        var rows = parseTeamHistoryRows(await fetchTeamHistory(false));
        if (editingHistoryRowIndex !== null && editingHistoryRowIndex !== undefined && !isNaN(editingHistoryRowIndex) && rows[editingHistoryRowIndex]) {
            rows[editingHistoryRowIndex] = { year: y, content: c };
        } else {
            rows.push({ year: y, content: c });
        }
        var joined = (rows || []).filter(function (r) { return r && r.year && r.content; })
            .sort(function (a, b) { return b.year - a.year; })
            .map(function (r) { return String(r.year) + ' ' + String(r.content).trim(); })
            .join('\n');
        if (isDbMode()) {
            await dbSetTeamContent('history', joined);
            invalidateDbCache(['team_history']);
        } else {
            setTeamHistory(joined);
        }
        await loadTeamIntro(true);
        await renderTeamHistoryFullList();
        alert('연혁이 저장되었습니다.');
        closeTeamHistoryRowModal();
    }

    async function handleTeamHistoryRowDelete() {
        if (editingHistoryRowIndex === null || editingHistoryRowIndex === undefined || isNaN(editingHistoryRowIndex)) return;
        if (!confirm('이 연혁 항목을 삭제하시겠습니까?')) return;
        var rows = parseTeamHistoryRows(await fetchTeamHistory(true));
        if (!rows[editingHistoryRowIndex]) return;
        rows.splice(editingHistoryRowIndex, 1);
        var joined = (rows || []).filter(function (r) { return r && r.year && r.content; })
            .sort(function (a, b) { return b.year - a.year; })
            .map(function (r) { return String(r.year) + ' ' + String(r.content).trim(); })
            .join('\n');
        if (isDbMode()) {
            await dbSetTeamContent('history', joined);
            invalidateDbCache(['team_history']);
        } else {
            setTeamHistory(joined);
        }
        editingHistoryRowIndex = null;
        closeTeamHistoryRowModal();
        await loadTeamIntro(true);
        await renderTeamHistoryFullList();
        alert('삭제되었습니다.');
    }

    async function loadTeamIntro(force) {
        var story = await fetchTeamStory(!!force);
        var values = await fetchTeamValues(!!force);
        var history = await fetchTeamHistory(!!force);
        renderTeamBlock(teamStoryContent, story, '등록된 창단 스토리가 없습니다.');
        renderTeamBlock(teamValuesContent, values, '등록된 팀 가치가 없습니다.');
        renderTeamHistoryGrid(teamHistoryContent, history);
    }

    async function openTeamStoryModal() {
        if (teamStoryText) teamStoryText.value = await fetchTeamStory(false);
        openModal('teamStoryModal');
        if (teamStoryText) teamStoryText.focus();
    }
    function closeTeamStoryModal() { closeModal('teamStoryModal'); }

    async function openTeamValuesModal() {
        if (teamValuesText) teamValuesText.value = await fetchTeamValues(false);
        openModal('teamValuesModal');
        if (teamValuesText) teamValuesText.focus();
    }
    function closeTeamValuesModal() { closeModal('teamValuesModal'); }

    async function openTeamHistoryModal() {
        if (teamHistoryText) teamHistoryText.value = await fetchTeamHistory(false);
        if (teamHistoryYear) teamHistoryYear.value = '';
        openModal('teamHistoryModal');
        if (teamHistoryYear) teamHistoryYear.focus();
    }
    function closeTeamHistoryModal() { closeModal('teamHistoryModal'); }

    async function handleTeamStorySubmit(e) {
        e.preventDefault();
        var v = teamStoryText ? teamStoryText.value : '';
        if (isDbMode()) {
            await dbSetTeamContent('story', v);
            invalidateDbCache(['team_story']);
        } else {
            setTeamStory(v);
        }
        await loadTeamIntro(true);
        alert('창단 스토리가 저장되었습니다.');
        closeTeamStoryModal();
    }

    async function handleTeamStoryDelete() {
        if (!confirm('창단 스토리를 삭제(비우기)하시겠습니까?')) return;
        await dbDeleteTeamContentKey('story');
        invalidateDbCache(['team_story']);
        if (teamStoryText) teamStoryText.value = '';
        await loadTeamIntro(true);
        alert('삭제되었습니다.');
        closeTeamStoryModal();
    }
    async function handleTeamValuesSubmit(e) {
        e.preventDefault();
        var v = teamValuesText ? teamValuesText.value : '';
        if (isDbMode()) {
            await dbSetTeamContent('values', v);
            invalidateDbCache(['team_values']);
        } else {
            setTeamValues(v);
        }
        await loadTeamIntro(true);
        alert('팀 가치가 저장되었습니다.');
        closeTeamValuesModal();
    }

    async function handleTeamValuesDelete() {
        if (!confirm('팀 가치를 삭제(비우기)하시겠습니까?')) return;
        await dbDeleteTeamContentKey('values');
        invalidateDbCache(['team_values']);
        if (teamValuesText) teamValuesText.value = '';
        await loadTeamIntro(true);
        alert('삭제되었습니다.');
        closeTeamValuesModal();
    }
    async function handleTeamHistorySubmit(e) {
        e.preventDefault();
        var raw = teamHistoryText ? teamHistoryText.value : '';
        var yearVal = teamHistoryYear && teamHistoryYear.value ? String(teamHistoryYear.value).trim() : '';
        var yNum = yearVal ? parseInt(yearVal, 10) : NaN;
        if (yearVal && isNaN(yNum)) {
            alert('년도는 숫자로 입력해 주세요.');
            if (teamHistoryYear) teamHistoryYear.focus();
            return;
        }
        var lines = String(raw || '').split(/\r?\n/);
        var out = [];
        lines.forEach(function (line) {
            var s = (line || '').trim();
            if (!s) return;
            // 이미 라인에 YYYY가 있으면 그대로 사용
            if (/^\s*\d{4}\b/.test(s)) {
                out.push(s);
                return;
            }
            // 라인 중간에 YYYY가 있으면 그대로 사용 (사용자 자유 입력 허용)
            if (/\b\d{4}\b/.test(s)) {
                out.push(s);
                return;
            }
            if (yearVal) out.push(yearVal + ' ' + s);
            else out.push(s);
        });
        if (out.length === 0) {
            alert('연혁 내용을 입력해 주세요.');
            if (teamHistoryText) teamHistoryText.focus();
            return;
        }
        var joined = out.join('\n');
        if (isDbMode()) {
            await dbSetTeamContent('history', joined);
            invalidateDbCache(['team_history']);
        } else {
            setTeamHistory(joined);
        }
        await loadTeamIntro(true);
        alert('연혁이 저장되었습니다.');
        closeTeamHistoryModal();
    }

    async function handleTeamHistoryDelete() {
        if (!confirm('연혁 전체를 삭제(비우기)하시겠습니까?')) return;
        await dbDeleteTeamContentKey('history');
        invalidateDbCache(['team_history']);
        if (teamHistoryText) teamHistoryText.value = '';
        await loadTeamIntro(true);
        alert('삭제되었습니다.');
        closeTeamHistoryModal();
    }

    function openPlayerAddModal() {
        editingPlayerId = null;
        if (playerModalTitle) playerModalTitle.textContent = '선수 등록';
        if (playerDeleteBtn) playerDeleteBtn.style.display = 'none';
        if (playerJerseyNo) playerJerseyNo.value = '';
        if (playerName) playerName.value = '';
        if (playerPrimaryPos) playerPrimaryPos.value = '';
        if (playerSecondaryPos) playerSecondaryPos.value = '';
        if (playerRole) playerRole.value = '4';
        if (playerStatus) playerStatus.value = '활동';
        if (playerContact) playerContact.value = '';
        openModal('playerModal');
        if (playerName) playerName.focus();
    }

    async function openPlayerEditModal(playerId) {
        var players = await fetchPlayers(false);
        var p = players.filter(function (x) { return x.id === playerId; })[0];
        if (!p) return;
        editingPlayerId = playerId;
        if (playerModalTitle) playerModalTitle.textContent = '선수 수정';
        if (playerDeleteBtn) playerDeleteBtn.style.display = '';
        if (playerJerseyNo) playerJerseyNo.value = String(p.jerseyNo || '');
        if (playerName) playerName.value = p.name || '';
        if (playerPrimaryPos) playerPrimaryPos.value = p.primaryPos || '';
        if (playerSecondaryPos) playerSecondaryPos.value = p.secondaryPos || '';
        if (playerRole) playerRole.value = p.role ? String(p.role) : '4';
        if (playerStatus) playerStatus.value = p.status || '활동';
        if (playerContact) playerContact.value = p.contact || '';
        openModal('playerModal');
        if (playerName) playerName.focus();
    }

    function closePlayerModal() {
        editingPlayerId = null;
        if (playerDeleteBtn) playerDeleteBtn.style.display = 'none';
        closeModal('playerModal');
    }

    async function handlePlayerSubmit(e) {
        e.preventDefault();
        var jersey = (playerJerseyNo && playerJerseyNo.value != null) ? String(playerJerseyNo.value).trim() : '';
        var name = (playerName && playerName.value ? playerName.value : '').trim();
        if (jersey === '') {
            alert('등번호를 입력해 주세요.');
            if (playerJerseyNo) playerJerseyNo.focus();
            return;
        }
        if (!name) {
            alert('성명을 입력해 주세요.');
            if (playerName) playerName.focus();
            return;
        }
        // 등번호 중복 방지(수정 시 본인은 제외)
        var jerseyKey = normalizeJerseyNoForCompare(jersey);
        var dupPlayers = isDbMode() ? await fetchPlayers(false) : getPlayers();
        var dup = dupPlayers.find(function (p) {
            if (!p) return false;
            if (editingPlayerId && String(p.id) === String(editingPlayerId)) return false;
            return normalizeJerseyNoForCompare(p.jerseyNo) === jerseyKey;
        });
        if (dup) {
            alert('이미 사용 중인 등번호입니다. (' + String(dup.jerseyNo || '') + ' / ' + String(dup.name || '') + ')');
            if (playerJerseyNo) playerJerseyNo.focus();
            return;
        }
        var ppos = (playerPrimaryPos && playerPrimaryPos.value ? playerPrimaryPos.value : '').trim();
        var spos = (playerSecondaryPos && playerSecondaryPos.value ? playerSecondaryPos.value : '').trim();
        var role = playerRole && playerRole.value ? String(playerRole.value) : '4';
        var stat = playerStatus && playerStatus.value ? playerStatus.value : '활동';
        var contact = (playerContact && playerContact.value ? playerContact.value : '').trim();

        var saved = null;
        if (isDbMode()) {
            if (editingPlayerId) {
                saved = {
                    id: editingPlayerId,
                    jerseyNo: jersey,
                    name: name,
                    primaryPos: ppos,
                    secondaryPos: spos,
                    role: role,
                    status: stat,
                    contact: contact,
                    createdAt: Date.now()
                };
            } else {
                saved = {
                    id: 'p_' + Date.now(),
                    jerseyNo: jersey,
                    name: name,
                    primaryPos: ppos,
                    secondaryPos: spos,
                    role: role,
                    status: stat,
                    contact: contact,
                    createdAt: Date.now()
                };
            }
            await dbUpsertPlayer(saved);
            invalidateDbCache(['players']);
        } else {
            var players = getPlayers();
            if (editingPlayerId) {
                var idx = players.findIndex(function (x) { return x.id === editingPlayerId; });
                if (idx !== -1) {
                    players[idx] = Object.assign({}, players[idx], {
                        jerseyNo: jersey,
                        name: name,
                        primaryPos: ppos,
                        secondaryPos: spos,
                        role: role,
                        status: stat,
                        contact: contact
                    });
                    saved = players[idx];
                }
            } else {
                saved = {
                    id: 'p_' + Date.now(),
                    jerseyNo: jersey,
                    name: name,
                    primaryPos: ppos,
                    secondaryPos: spos,
                    role: role,
                    status: stat,
                    contact: contact
                };
                players.unshift(saved);
            }
            savePlayers(players);
        }

        await loadPlayerTable(true);
        await loadPersonalRecordsTable(true); // 개인기록 탭도 선수단 기반이므로 갱신
        await loadTeamRecordsTab(true);
        closePlayerModal();
    }

    async function handlePlayerDelete() {
        if (!editingPlayerId) return;
        if (!confirm('이 선수를 삭제하시겠습니까?\n(개인기록도 함께 삭제됩니다)')) return;
        await dbDeletePlayer(editingPlayerId);
        invalidateDbCache(['players', 'personal']);
        editingPlayerId = null;
        closePlayerModal();
        await loadPlayerTable(true);
        await loadPersonalRecordsTable(true);
        await loadTeamRecordsTab(true);
        alert('삭제되었습니다.');
    }

    function roleLabel(roleVal) {
        var v = String(roleVal || '4');
        if (v === '9') return '관리자';
        if (v === '1') return '감독';
        if (v === '2') return '코치';
        if (v === '3') return '총무';
        return '선수';
    }

    function isActivePlayer(p) {
        if (!p) return false;
        var stat = p.status || '활동';
        if (stat !== '활동') return false;
        // 스텝여부(감독/코치/총무/선수) 모두 기록 대상: 활동 여부만 체크
        return true;
    }

    // 팀기록·개인기록·투수기록·선수 콤보박스에서 관리자(role 9) 제외
    function isPlayerForRecords(p) {
        if (!isActivePlayer(p)) return false;
        if (String(p.role || '4') === '9') return false;
        return true;
    }

    async function loadPlayerTable(force) {
        if (!playerTableBody) return;
        seedPlayersIfEmpty();
        var players = (await fetchPlayers(!!force)).slice();
        players.sort(function (a, b) { return toInt(a.jerseyNo) - toInt(b.jerseyNo); });
        if (players.length === 0) {
            playerTableBody.innerHTML = '<tr><td colspan="7" class="schedule-table-empty">등록된 선수가 없습니다.</td></tr>';
            return;
        }
        playerTableBody.innerHTML = players.map(function (p) {
            return '<tr class="schedule-table-row roster-row" data-player-id="' + escapeHtml(p.id) + '" title="더블클릭: 상세 확인 및 수정">' +
                '<td>' + escapeHtml(String(p.jerseyNo || '')) + '</td>' +
                '<td>' + escapeHtml(p.name || '') + '</td>' +
                '<td>' + escapeHtml(roleLabel(p.role)) + '</td>' +
                '<td>' + escapeHtml(p.primaryPos || '') + '</td>' +
                '<td>' + escapeHtml(p.secondaryPos || '') + '</td>' +
                '<td>' + escapeHtml(p.status || '활동') + '</td>' +
                '<td>' + escapeHtml(p.contact || '') + '</td>' +
                '</tr>';
        }).join('');
        playerTableBody.querySelectorAll('.roster-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var pid = el.getAttribute('data-player-id');
                if (pid) return openPlayerEditModal(pid);
            }));
        });
    }

    async function renderPlayerFullList(force) {
        if (!playerFullBody) return;
        seedPlayersIfEmpty();
        var players = (await fetchPlayers(!!force)).slice();
        players.sort(function (a, b) { return toInt(a.jerseyNo) - toInt(b.jerseyNo); });
        if (players.length === 0) {
            playerFullBody.innerHTML = '<tr><td colspan="7" class="schedule-table-empty">등록된 선수가 없습니다.</td></tr>';
            return;
        }
        playerFullBody.innerHTML = players.map(function (p) {
            return '<tr class="schedule-table-row roster-full-row" data-player-id="' + escapeHtml(p.id) + '" title="더블클릭: 수정">' +
                '<td>' + escapeHtml(String(p.jerseyNo || '')) + '</td>' +
                '<td>' + escapeHtml(p.name || '') + '</td>' +
                '<td>' + escapeHtml(roleLabel(p.role)) + '</td>' +
                '<td>' + escapeHtml(p.primaryPos || '') + '</td>' +
                '<td>' + escapeHtml(p.secondaryPos || '') + '</td>' +
                '<td>' + escapeHtml(p.status || '활동') + '</td>' +
                '<td>' + escapeHtml(p.contact || '') + '</td>' +
                '</tr>';
        }).join('');

        playerFullBody.querySelectorAll('.roster-full-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var pid = el.getAttribute('data-player-id');
                if (!pid) return;
                closePlayerListModal();
                return openPlayerEditModal(pid);
            }));
        });
    }

    async function openPlayerListModal() {
        await renderPlayerFullList(false);
        openModal('playerListModal');
    }

    function closePlayerListModal() {
        closeModal('playerListModal');
    }

    function setupTeamTabs() {
        var btns = document.querySelectorAll('.team-tabs .tab-btn');
        var panels = document.querySelectorAll('.team-panels .tab-panel');
        btns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                if (!requireLogin(e)) return;
                var tab = btn.getAttribute('data-tab');
                if (!tab) return;
                btns.forEach(function (b) { b.classList.remove('active'); });
                panels.forEach(function (p) { p.classList.remove('active'); });
                btn.classList.add('active');
                var panel = document.getElementById('team-tab-' + tab);
                if (panel) panel.classList.add('active');
            });
        });
    }

    function seedPlayersIfEmpty() {
        // Supabase 사용 시에는 임의 seed를 넣지 않음(공유 데이터/이관 데이터가 기준)
        if (isSupabaseReady()) return;
        var players = getPlayers();
        if (players.length > 0) return;
        // 기본 샘플(초기 화면용) - 이후 선수단 기능에서 교체 가능
        savePlayers([
            { id: 'p_' + (Date.now() + 1), jerseyNo: 1, name: '홍길동', role: '9', status: '활동', contact: '010-0000-0001' },
            { id: 'p_' + (Date.now() + 2), jerseyNo: 7, name: '김야구', role: '4', status: '활동', contact: '010-0000-0007' },
            { id: 'p_' + (Date.now() + 3), jerseyNo: 12, name: '박타자', role: '4', status: '활동', contact: '010-0000-0012' }
        ]);
    }

    function toInt(val) {
        var n = parseInt(String(val || '0'), 10);
        return isNaN(n) ? 0 : n;
    }

    // 등번호 비교용 정규화(선행 0 제거). 저장 값은 그대로 두되, 중복 체크에는 정규화 값을 사용.
    function normalizeJerseyNoForCompare(val) {
        var s = String(val == null ? '' : val).trim();
        if (!s) return '';
        if (/^\d+$/.test(s)) return String(parseInt(s, 10)); // "00" -> "0", "01" -> "1"
        return s;
    }

    function calcAvg(hits, atBats) {
        var ab = toInt(atBats);
        var h = toInt(hits);
        if (ab <= 0) return '0.000';
        return (h / ab).toFixed(3);
    }

    function filterSchedulesByLeague(list, leagueId) {
        list = list || [];
        if (!leagueId) return list.slice();
        return list.filter(function (s) {
            var lid = s && s.leagueId ? String(s.leagueId) : 'nono';
            return normalizeLeagueId(lid) === String(leagueId);
        });
    }

    // 팀기록/시즌전적에 반영하지 않을 구장 (시범경기, 올스타)
    var EXCLUDED_VENUE_PATTERNS = ['시범경기', '올스타'];
    function isExcludedVenue(location) {
        if (!location || typeof location !== 'string') return false;
        var loc = String(location).trim();
        return EXCLUDED_VENUE_PATTERNS.some(function (p) { return loc.indexOf(p) !== -1; });
    }
    function filterSchedulesExcludeVenues(list) {
        return (list || []).filter(function (s) { return !isExcludedVenue(s && s.location); });
    }

    function aggregatePersonalRecords(records) {
        var by = {};
        (records || []).forEach(function (r) {
            if (!r || !r.playerId) return;
            var pid = String(r.playerId);
            if (!by[pid]) {
                by[pid] = {
                    leagueId: '',
                    playerId: pid,
                    pa: 0, ab: 0, h: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0,
                    avg: '0.000',
                    updatedAt: r.updatedAt || 0
                };
            }
            var it = by[pid];
            it.pa += toInt(r.pa);
            it.ab += toInt(r.ab);
            it.h += toInt(r.h);
            it.rbi += toInt(r.rbi);
            it.r += toInt(r.r);
            it.bb += toInt(r.bb);
            it.so += toInt(r.so);
            it.sb += toInt(r.sb);
            it.updatedAt = Math.max(it.updatedAt || 0, r.updatedAt || 0);
        });
        return Object.keys(by).map(function (k) {
            var it = by[k];
            it.avg = calcAvg(it.h, it.ab);
            return it;
        });
    }

    function recordsForLeague(records, leagueId) {
        if (!leagueId) return aggregatePersonalRecords(records);
        var lid = String(leagueId);
        var filtered = (records || []).filter(function (r) {
            var rid = r && r.leagueId ? String(r.leagueId) : 'nono';
            return normalizeLeagueId(rid) === lid;
        });
        // 안전하게(중복 방지) 1인 1건으로 합산
        return aggregatePersonalRecords(filtered).map(function (x) { x.leagueId = lid; return x; });
    }

    async function deriveRecordsFromGameLines(leagueId, force) {
        // 기록지 저장 직후에도 즉시 반영되도록 스케줄은 항상 최신으로 조회
        var schedules = filterSchedulesByLeague(await fetchSchedules(true), leagueId);
        schedules = filterSchedulesExcludeVenues(schedules);
        var ids = (schedules || []).map(function (s) { return s && s.id ? s.id : ''; }).filter(Boolean);
        if (!ids.length) return { personal: [], pitcher: [], hasGameLines: false };

        var battingLines = await dbListGameBattingLinesByScheduleIds(ids);
        var pitchingLines = await dbListGamePitchingLinesByScheduleIds(ids);
        var hasGameLines = (battingLines && battingLines.length > 0) || (pitchingLines && pitchingLines.length > 0);

        var byBat = {};
        (battingLines || []).forEach(function (ln) {
            if (!ln || !ln.playerId) return;
            var pid = String(ln.playerId);
            if (!byBat[pid]) byBat[pid] = { pa: 0, ab: 0, h: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0 };
            var it = byBat[pid];
            it.pa += toInt(ln.pa);
            it.ab += toInt(ln.ab);
            it.h += toInt(ln.h);
            it.rbi += toInt(ln.rbi);
            it.r += toInt(ln.r);
            it.bb += toInt(ln.bb);
            it.so += toInt(ln.so);
            it.sb += toInt(ln.sb);
        });
        var personal = Object.keys(byBat).map(function (pid) {
            var it = byBat[pid];
            var ab = toInt(it.ab);
            var h = toInt(it.h);
            return {
                leagueId: normalizeLeagueId(leagueId || 'nono'),
                playerId: pid,
                pa: toInt(it.pa) > 0 ? toInt(it.pa) : ab,
                ab: ab,
                h: h,
                rbi: toInt(it.rbi),
                r: toInt(it.r),
                bb: toInt(it.bb),
                so: toInt(it.so),
                sb: toInt(it.sb),
                avg: calcAvg(h, ab),
                updatedAt: Date.now()
            };
        });

        var byPitch = {};
        (pitchingLines || []).forEach(function (ln) {
            if (!ln || !ln.playerId) return;
            var pid = String(ln.playerId);
            if (!byPitch[pid]) byPitch[pid] = { ip: 0, h: 0, er: 0, w: 0, l: 0, sv: 0 };
            var it = byPitch[pid];
            it.ip += parseFloat(String(ln.ip || 0)) || 0;
            it.h += toInt(ln.h);
            it.er += toInt(ln.er);
            it.w += toInt(ln.w);
            it.l += toInt(ln.l);
            it.sv += toInt(ln.sv);
        });
        var pitcher = Object.keys(byPitch).map(function (pid) {
            var it = byPitch[pid];
            return {
                leagueId: normalizeLeagueId(leagueId || 'nono'),
                playerId: pid,
                ip: parseFloat(String(it.ip || 0)),
                h: toInt(it.h),
                er: toInt(it.er),
                w: toInt(it.w),
                l: toInt(it.l),
                sv: toInt(it.sv),
                updatedAt: Date.now()
            };
        });

        return { personal: personal, pitcher: pitcher, hasGameLines: hasGameLines };
    }

    function computeTeamRecords(players, recs, schedulesAll, pitcherRecs) {
        // 개인기록 합산으로 팀 타율 계산 (활동 선수 기준, 관리자 제외)
        players = (players || []).filter(isPlayerForRecords);
        recs = recs || [];
        var recById = {};
        recs.forEach(function (r) { recById[r.playerId] = r; });

        var totalAB = 0, totalH = 0;
        players.forEach(function (p) {
            var r = recById[p.id];
            if (!r) return;
            totalAB += toInt(r.ab);
            totalH += toInt(r.h);
        });
        var teamAvg = totalAB > 0 ? (totalH / totalAB).toFixed(3) : '0.000';

        // 팀 방어율: 해당 리그 투수기록 합산 (sum(er)*9 / sum(ip))
        var teamEra = '-';
        pitcherRecs = pitcherRecs || [];
        if (pitcherRecs.length > 0) {
            var totalIp = 0, totalEr = 0;
            pitcherRecs.forEach(function (r) {
                totalIp += parseFloat(String(r.ip || 0));
                totalEr += toInt(r.er);
            });
            if (totalIp > 0) teamEra = ((totalEr * 9) / totalIp).toFixed(2);
        }
        // 투수기록이 아직 없더라도, 완료 경기 점수(상대 득점) 기준으로 최소 표시값 제공
        if (teamEra === '-') {
            var completedForEra = filterSchedulesExcludeVenues(schedulesAll || []).filter(function (s) {
                return s && s.status === '완료' && s.opponentScore !== undefined && s.opponentScore !== '' && !isNaN(parseInt(String(s.opponentScore), 10));
            });
            if (completedForEra.length > 0) {
                var totalOppRuns = 0;
                completedForEra.forEach(function (s) { totalOppRuns += toInt(s.opponentScore); });
                // 9이닝 기준 ERA가 없을 때, 경기당 실점 평균으로 대체 표시
                teamEra = (totalOppRuns / completedForEra.length).toFixed(2);
            }
        }

        // 최근 전적: 완료된 경기 중 최근 10경기 기준 승/패 (시범경기·올스타 구장 제외)
        // result가 비어 있어도 스코어 기반으로 승/패/무 판정(getResultFromSchedule)
        var schedules = filterSchedulesExcludeVenues(schedulesAll || []).filter(function (s) {
            if (!s || s.status !== '완료') return false;
            var r = getResultFromSchedule(s);
            return r === '승' || r === '패';
        });
        schedules.sort(function (a, b) {
            var da = a.date ? new Date(a.date) : null;
            var db = b.date ? new Date(b.date) : null;
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return db.getTime() - da.getTime();
        });
        var recent = schedules.slice(0, 10);
        var w = 0, l = 0;
        recent.forEach(function (s) {
            var r = getResultFromSchedule(s);
            if (r === '승') w += 1;
            else if (r === '패') l += 1;
        });

        return { teamAvg: teamAvg, teamEra: teamEra, recentW: w, recentL: l };
    }

    function buildLeaderboardRows(metricKey, players, recs) {
        players = (players || []).filter(isPlayerForRecords);
        recs = recs || [];
        var recById = {};
        recs.forEach(function (r) { recById[r.playerId] = r; });

        var items = players.map(function (p) {
            var r = recById[p.id];
            var ab = r ? toInt(r.ab) : 0;
            var h = r ? toInt(r.h) : 0;
            var rbi = r ? toInt(r.rbi) : 0;
            var sb = r ? toInt(r.sb) : 0;
            var avg = r ? (r.avg || calcAvg(h, ab)) : calcAvg(0, 0);
            var val;
            if (metricKey === 'avg') val = parseFloat(avg);
            else if (metricKey === 'h') val = h;
            else if (metricKey === 'rbi') val = rbi;
            else if (metricKey === 'sb') val = sb;
            else val = 0;
            return { jerseyNo: p.jerseyNo || '', name: p.name || '', avg: avg, h: h, rbi: rbi, sb: sb, sortVal: val };
        });

        items.sort(function (a, b) {
            // 내림차순
            if (b.sortVal !== a.sortVal) return (b.sortVal - a.sortVal);
            return toInt(a.jerseyNo) - toInt(b.jerseyNo);
        });

        return items.slice(0, 5);
    }

    function renderLeaderboard(tbody, rows, kind) {
        if (!tbody) return;
        if (!rows || rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="schedule-table-empty">데이터 없음</td></tr>';
            return;
        }
        tbody.innerHTML = rows.map(function (r, idx) {
            var stat = '';
            if (kind === 'avg') stat = r.avg;
            else if (kind === 'h') stat = String(r.h);
            else if (kind === 'rbi') stat = String(r.rbi);
            else if (kind === 'sb') stat = String(r.sb);
            return '<tr>' +
                '<td>' + (idx + 1) + '</td>' +
                '<td>' + escapeHtml(String(r.jerseyNo)) + '</td>' +
                '<td>' + escapeHtml(String(r.name)) + '</td>' +
                '<td>' + escapeHtml(String(stat)) + '</td>' +
                '</tr>';
        }).join('');
    }

    async function loadTeamRecordsTab(force) {
        if (!teamBattingAvg && !rankAvgBody) return; // 탭이 없으면 skip
        seedPlayersIfEmpty();
        var players = await fetchPlayers(!!force);
        var leagueId = getSelectedLeague();
        var recs = recordsForLeague(await fetchPersonalRecords(!!force), leagueId);
        var pitcherRecs = pitcherRecordsForLeague(await fetchPitcherRecords(!!force), leagueId);
        var derived = await deriveRecordsFromGameLines(leagueId, !!force);
        if (derived.hasGameLines) {
            recs = derived.personal;
            pitcherRecs = derived.pitcher;
        }
        var schedules = filterSchedulesByLeague(await fetchSchedules(!!force), leagueId);
        var summary = computeTeamRecords(players, recs, schedules, pitcherRecs);
        if (teamBattingAvg) teamBattingAvg.textContent = summary.teamAvg;
        if (teamEra) teamEra.textContent = summary.teamEra;
        if (teamRecentRecord) teamRecentRecord.textContent = summary.recentW + '승 ' + summary.recentL + '패';

        renderLeaderboard(rankAvgBody, buildLeaderboardRows('avg', players, recs), 'avg');
        renderLeaderboard(rankHitsBody, buildLeaderboardRows('h', players, recs), 'h');
        renderLeaderboard(rankRbiBody, buildLeaderboardRows('rbi', players, recs), 'rbi');
        renderLeaderboard(rankSbBody, buildLeaderboardRows('sb', players, recs), 'sb');
    }

    function upsertPersonalRecord(leagueId, playerId, rec) {
        var arr = getPersonalRecords();
        leagueId = normalizeLeagueId(leagueId || 'nono');
        var idx = arr.findIndex(function (x) {
            if (!x) return false;
            var lid = normalizeLeagueId(x.leagueId || 'nono');
            return String(x.playerId) === String(playerId) && lid === leagueId;
        });
        if (idx === -1) arr.unshift(rec);
        else arr[idx] = rec;
        savePersonalRecords(arr);
    }

    function findPersonalRecord(leagueId, playerId) {
        var arr = getPersonalRecords();
        leagueId = normalizeLeagueId(leagueId || 'nono');
        return arr.filter(function (x) {
            if (!x) return false;
            var lid = normalizeLeagueId(x.leagueId || 'nono');
            return String(x.playerId) === String(playerId) && lid === leagueId;
        })[0] || null;
    }

    function pitcherRecordsForLeague(records, leagueId) {
        if (!leagueId) return (records || []).filter(function (r) { return !!r; });
        var lid = normalizeLeagueId(leagueId);
        return (records || []).filter(function (r) {
            return r && normalizeLeagueId(r.leagueId || 'nono') === lid;
        });
    }

    function upsertPitcherRecord(leagueId, playerId, rec) {
        var arr = getPitcherRecords();
        leagueId = normalizeLeagueId(leagueId || 'nono');
        var idx = arr.findIndex(function (x) {
            return x && String(x.playerId) === String(playerId) && normalizeLeagueId(x.leagueId || 'nono') === leagueId;
        });
        if (idx === -1) arr.unshift(rec);
        else arr[idx] = rec;
        savePitcherRecords(arr);
    }

    function findPitcherRecord(leagueId, playerId) {
        var arr = getPitcherRecords();
        leagueId = normalizeLeagueId(leagueId || 'nono');
        return arr.filter(function (x) {
            return x && String(x.playerId) === String(playerId) && normalizeLeagueId(x.leagueId || 'nono') === leagueId;
        })[0] || null;
    }

    // 투수 이닝(IP) 표기 파서: 5, 5.1(1/3), 5.2(2/3) 지원. (그 외 5.3 등은 invalid)
    // - innings: ERA 계산용 실제 이닝(예: 5.1 -> 5.3333...)
    // - ipForStore: 기존과 동일하게 표기값을 숫자로 저장(예: 5.1)
    function parsePitchIp(ipVal) {
        var raw = String(ipVal == null ? '' : ipVal).trim();
        if (raw === '') return { ok: true, innings: 0, ipForStore: 0, raw: '' };
        // "5." 같은 입력 방지
        if (!/^\d+(\.\d+)?$/.test(raw)) return { ok: false, innings: 0, ipForStore: 0, raw: raw };

        var parts = raw.split('.');
        var whole = parseInt(parts[0], 10);
        if (!parts[1] || parts[1] === '0') {
            return { ok: true, innings: whole, ipForStore: whole, raw: raw };
        }

        // 소수점 1자리: 표기법(1/3, 2/3) 처리
        if (parts[1].length === 1) {
            var d = parseInt(parts[1], 10);
            if (d === 1) return { ok: true, innings: whole + (1 / 3), ipForStore: parseFloat(raw), raw: raw };
            if (d === 2) return { ok: true, innings: whole + (2 / 3), ipForStore: parseFloat(raw), raw: raw };
            return { ok: false, innings: 0, ipForStore: 0, raw: raw };
        }

        // 소수점이 여러 자리면(과거 데이터 등) "실제 이닝"으로 간주해 그대로 사용
        var n = parseFloat(raw);
        if (isNaN(n) || n < 0) return { ok: false, innings: 0, ipForStore: 0, raw: raw };
        return { ok: true, innings: n, ipForStore: n, raw: raw };
    }

    /** 방어율: (자책점 * 9) / 이닝, 이닝 0이면 '-' */
    function calcEra(er, ip) {
        var e = toInt(er);
        var parsed = parsePitchIp(ip);
        var innings = parsed.ok ? parsed.innings : parseFloat(String(ip || 0));
        if (!innings || innings <= 0) return '-';
        return ((e * 9) / innings).toFixed(2);
    }

    async function loadPersonalRecordsTable(force) {
        if (!personalRecordTableBody) return;
        seedPlayersIfEmpty();
        var players = (await fetchPlayers(!!force)).filter(isPlayerForRecords);
        players.sort(function (a, b) { return toInt(a.jerseyNo) - toInt(b.jerseyNo); });
        var leagueId = getSelectedLeague();
        var records = recordsForLeague(await fetchPersonalRecords(!!force), leagueId);
        var derived = await deriveRecordsFromGameLines(leagueId, !!force);
        if (derived.hasGameLines) records = derived.personal;
        var byId = {};
        records.forEach(function (r) { if (r && r.playerId) byId[String(r.playerId)] = r; });

        if (players.length === 0) {
            personalRecordTableBody.innerHTML = '<tr><td colspan="11" class="schedule-table-empty">활동 중인 선수가 없습니다.</td></tr>';
            return;
        }

        personalRecordTableBody.innerHTML = players.map(function (p) {
            var r = byId[p.id] || null;
            var pa = r ? toInt(r.pa) : 0;
            var ab = r ? toInt(r.ab) : 0;
            var h = r ? toInt(r.h) : 0;
            var rbi = r ? toInt(r.rbi) : 0;
            var runs = r ? toInt(r.r) : 0;
            var bb = r ? toInt(r.bb) : 0;
            var so = r ? toInt(r.so) : 0;
            var sb = r ? toInt(r.sb) : 0;
            var avg = r ? (r.avg || calcAvg(h, ab)) : '0.000';
            return '<tr class="schedule-table-row personal-row" data-player-id="' + escapeHtml(p.id) + '" title="더블클릭: 상세 확인 및 수정">' +
                '<td>' + escapeHtml(String(p.jerseyNo || '')) + '</td>' +
                '<td>' + escapeHtml(p.name || '') + '</td>' +
                '<td>' + pa + '</td>' +
                '<td>' + ab + '</td>' +
                '<td>' + h + '</td>' +
                '<td>' + rbi + '</td>' +
                '<td>' + runs + '</td>' +
                '<td>' + bb + '</td>' +
                '<td>' + so + '</td>' +
                '<td>' + sb + '</td>' +
                '<td>' + escapeHtml(avg) + '</td>' +
                '</tr>';
        }).join('');

        personalRecordTableBody.querySelectorAll('.personal-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var pid = el.getAttribute('data-player-id');
                if (pid) return openPersonalRecordModal(pid);
            }));
        });
    }

    async function renderPersonalRecordsToTbody(tbody, force) {
        if (!tbody) return;
        seedPlayersIfEmpty();
        var players = (await fetchPlayers(!!force)).filter(isPlayerForRecords);
        players.sort(function (a, b) { return toInt(a.jerseyNo) - toInt(b.jerseyNo); });
        var leagueId = getSelectedLeague();
        var records = recordsForLeague(await fetchPersonalRecords(!!force), leagueId);
        var derived = await deriveRecordsFromGameLines(leagueId, !!force);
        if (derived.hasGameLines) records = derived.personal;
        var byId = {};
        records.forEach(function (r) { if (r && r.playerId) byId[String(r.playerId)] = r; });

        if (players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11" class="schedule-table-empty">활동 중인 선수가 없습니다.</td></tr>';
            return;
        }

        tbody.innerHTML = players.map(function (p) {
            var r = byId[p.id] || null;
            var pa = r ? toInt(r.pa) : 0;
            var ab = r ? toInt(r.ab) : 0;
            var h = r ? toInt(r.h) : 0;
            var rbi = r ? toInt(r.rbi) : 0;
            var runs = r ? toInt(r.r) : 0;
            var bb = r ? toInt(r.bb) : 0;
            var so = r ? toInt(r.so) : 0;
            var sb = r ? toInt(r.sb) : 0;
            var avg = r ? (r.avg || calcAvg(h, ab)) : '0.000';
            return '<tr class="schedule-table-row personal-full-row" data-player-id="' + escapeHtml(p.id) + '" title="더블클릭: 상세 확인 및 수정">' +
                '<td>' + escapeHtml(String(p.jerseyNo || '')) + '</td>' +
                '<td>' + escapeHtml(p.name || '') + '</td>' +
                '<td>' + pa + '</td>' +
                '<td>' + ab + '</td>' +
                '<td>' + h + '</td>' +
                '<td>' + rbi + '</td>' +
                '<td>' + runs + '</td>' +
                '<td>' + bb + '</td>' +
                '<td>' + so + '</td>' +
                '<td>' + sb + '</td>' +
                '<td>' + escapeHtml(avg) + '</td>' +
                '</tr>';
        }).join('');

        tbody.querySelectorAll('.personal-full-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var pid = el.getAttribute('data-player-id');
                if (!pid) return;
                closePersonalRecordListModal();
                return openPersonalRecordModal(pid);
            }));
        });
    }

    async function openPersonalRecordListModal() {
        await renderPersonalRecordsToTbody(personalRecordFullBody, false);
        openModal('personalRecordListModal');
    }

    function closePersonalRecordListModal() {
        closeModal('personalRecordListModal');
    }

    function syncPersonalComputedFields() {
        // 요구사항: 타점 자동 계산 (현재는 안타 기반으로 자동 계산)
        var h = toInt(prH && prH.value);
        var ab = toInt(prAB && prAB.value);
        if (prRBI) prRBI.value = String(h);
        if (prAVG) prAVG.value = calcAvg(h, ab);
    }

    async function openPersonalRecordModal(playerId) {
        seedPlayersIfEmpty();
        var leagueId = getSelectedLeague() || 'nono';
        var players = await fetchPlayers(false);
        var p = players.filter(function (x) { return x.id === playerId; })[0] || null;
        var records = await fetchPersonalRecords(false);
        // 모달에서 리그를 선택할 수 있게 기본값 세팅
        if (prLeague) prLeague.value = leagueId;
        var r = playerId ? (records.filter(function (x) { return x && String(x.playerId) === String(playerId) && normalizeLeagueId(x.leagueId || 'nono') === normalizeLeagueId(leagueId); })[0] || null) : null;
        editingPersonalPlayerId = playerId || null;
        editingPersonalLeagueId = leagueId;
        if (personalRecordModalTitle) personalRecordModalTitle.textContent = playerId ? '개인기록 수정' : '개인기록 등록';
        if (personalRecordDeleteBtn) personalRecordDeleteBtn.style.display = playerId ? '' : 'none';

        if (prJerseyNo) prJerseyNo.value = p && p.jerseyNo !== undefined ? String(p.jerseyNo) : '';
        if (prName) prName.value = p ? (p.name || '') : '';

        if (prPA) prPA.value = r ? String(toInt(r.pa)) : '0';
        if (prAB) prAB.value = r ? String(toInt(r.ab)) : '0';
        if (prH) prH.value = r ? String(toInt(r.h)) : '0';
        if (prR) prR.value = r ? String(toInt(r.r)) : '0';
        if (prBB) prBB.value = r ? String(toInt(r.bb)) : '0';
        if (prSO) prSO.value = r ? String(toInt(r.so)) : '0';
        if (prSB) prSB.value = r ? String(toInt(r.sb)) : '0';
        syncPersonalComputedFields();

        if (prName) prName.focus();
        openModal('personalRecordModal');
    }

    function closePersonalRecordModal() {
        editingPersonalPlayerId = null;
        editingPersonalLeagueId = null;
        if (personalRecordDeleteBtn) personalRecordDeleteBtn.style.display = 'none';
        closeModal('personalRecordModal');
    }

    async function handlePersonalRecordSubmit(e) {
        e.preventDefault();
        seedPlayersIfEmpty();
        var leagueId = prLeague && prLeague.value ? normalizeLeagueId(prLeague.value) : (getSelectedLeague() || 'nono');
        var jersey = (prJerseyNo && prJerseyNo.value != null) ? String(prJerseyNo.value).trim() : '';
        var name = (prName && prName.value ? prName.value : '').trim();
        if (jersey === '') {
            alert('등번호를 입력해 주세요.');
            if (prJerseyNo) prJerseyNo.focus();
            return;
        }
        if (!name) {
            alert('성명을 입력해 주세요.');
            if (prName) prName.focus();
            return;
        }

        // 개인기록 수치 검증(기본 논리)
        var pa = toInt(prPA && prPA.value);
        var ab = toInt(prAB && prAB.value);
        var h = toInt(prH && prH.value);
        var rbi = toInt(prRBI && prRBI.value);
        var r = toInt(prR && prR.value);
        var bb = toInt(prBB && prBB.value);
        var so = toInt(prSO && prSO.value);
        var sb = toInt(prSB && prSB.value);
        if (pa < 0 || ab < 0 || h < 0 || rbi < 0 || r < 0 || bb < 0 || so < 0 || sb < 0) {
            alert('기록 수치는 0 이상이어야 합니다.');
            return;
        }
        if (ab > pa) {
            alert('타수(AB)는 타석(PA)보다 클 수 없습니다.');
            if (prAB) prAB.focus();
            return;
        }
        if (h > ab) {
            alert('안타(H)는 타수(AB)보다 클 수 없습니다.');
            if (prH) prH.focus();
            return;
        }

        // 등번호 중복 방지(수정 시 본인은 제외)
        var prJerseyKey = normalizeJerseyNoForCompare(jersey);
        var prDupPlayers = isDbMode() ? await fetchPlayers(false) : getPlayers();
        var prDup = prDupPlayers.find(function (p) {
            if (!p) return false;
            if (editingPersonalPlayerId && String(p.id) === String(editingPersonalPlayerId)) return false;
            return normalizeJerseyNoForCompare(p.jerseyNo) === prJerseyKey;
        });
        if (prDup) {
            alert('이미 사용 중인 등번호입니다. (' + String(prDup.jerseyNo || '') + ' / ' + String(prDup.name || '') + ')');
            if (prJerseyNo) prJerseyNo.focus();
            return;
        }

        var players = isDbMode() ? await fetchPlayers(false) : getPlayers();
        var pid = editingPersonalPlayerId;
        if (!pid) {
            // 신규 선수 + 기록
            pid = 'p_' + Date.now();
            var newPlayer = { id: pid, jerseyNo: jersey, name: name, status: '활동', role: '4', contact: '' };
            if (isDbMode()) {
                await dbUpsertPlayer(Object.assign({ createdAt: Date.now() }, newPlayer));
                invalidateDbCache(['players']);
            } else {
                players.unshift(newPlayer);
                savePlayers(players);
            }
        } else {
            // 기존 선수 기본정보도 동기화
            if (isDbMode()) {
                await dbUpsertPlayer({
                    id: pid,
                    jerseyNo: jersey,
                    name: name,
                    role: '4',
                    primaryPos: '',
                    secondaryPos: '',
                    status: '활동',
                    contact: '',
                    createdAt: Date.now()
                });
                invalidateDbCache(['players']);
            } else {
                var pidx = players.findIndex(function (x) { return x.id === pid; });
                if (pidx !== -1) {
                    players[pidx].jerseyNo = jersey;
                    players[pidx].name = name;
                    if (!players[pidx].status) players[pidx].status = '활동';
                    savePlayers(players);
                }
            }
        }

        syncPersonalComputedFields();
        var rec = {
            leagueId: leagueId,
            playerId: pid,
            jerseyNo: jersey,
            name: name,
            pa: pa,
            ab: ab,
            h: h,
            rbi: rbi,
            r: r,
            bb: bb,
            so: so,
            sb: sb,
            avg: prAVG ? (prAVG.value || calcAvg(h, ab)) : '0.000',
            updatedAt: Date.now()
        };
        if (isDbMode()) {
            await dbUpsertPersonalRecord(rec);
            invalidateDbCache(['personal']);
        } else {
            upsertPersonalRecord(leagueId, pid, rec);
        }
        await loadPersonalRecordsTable(true);
        await loadTeamRecordsTab(true);
        closePersonalRecordModal();
    }

    async function handlePersonalRecordDelete() {
        if (!editingPersonalPlayerId) return;
        if (!confirm('이 선수의 개인기록을 삭제하시겠습니까?')) return;
        await dbDeletePersonalRecord(editingPersonalLeagueId || (prLeague && prLeague.value) || 'nono', editingPersonalPlayerId);
        invalidateDbCache(['personal']);
        closePersonalRecordModal();
        await loadPersonalRecordsTable(true);
        await loadTeamRecordsTab(true);
        alert('삭제되었습니다.');
    }

    function syncPitcherEra() {
        var er = toInt(pitchEr && pitchEr.value);
        var parsed = parsePitchIp(pitchIp && pitchIp.value);
        if (pitchEra) pitchEra.value = parsed.ok ? calcEra(er, parsed.ipForStore) : '-';
    }

    async function loadPitcherRecordsTable(force) {
        if (!pitcherRecordTableBody) return;
        seedPlayersIfEmpty();
        var players = (await fetchPlayers(!!force)).filter(isPlayerForRecords);
        players.sort(function (a, b) { return toInt(a.jerseyNo) - toInt(b.jerseyNo); });
        var leagueId = getSelectedLeague();
        var records = pitcherRecordsForLeague(await fetchPitcherRecords(!!force), leagueId);
        var derived = await deriveRecordsFromGameLines(leagueId, !!force);
        if (derived.hasGameLines) records = derived.pitcher;
        var byId = {};
        records.forEach(function (r) { if (r && r.playerId) byId[String(r.playerId)] = r; });

        if (players.length === 0) {
            pitcherRecordTableBody.innerHTML = '<tr><td colspan="9" class="schedule-table-empty">활동 중인 선수가 없습니다.</td></tr>';
            return;
        }

        pitcherRecordTableBody.innerHTML = players.map(function (p) {
            var r = byId[p.id] || null;
            var ip = r ? parseFloat(String(r.ip || 0)) : 0;
            var h = r ? toInt(r.h) : 0;
            var er = r ? toInt(r.er) : 0;
            var w = r ? toInt(r.w) : 0;
            var l = r ? toInt(r.l) : 0;
            var sv = r ? toInt(r.sv) : 0;
            var era = r ? calcEra(r.er, r.ip) : '-';
            return '<tr class="schedule-table-row pitcher-row" data-player-id="' + escapeHtml(p.id) + '" title="더블클릭: 수정">' +
                '<td>' + escapeHtml(String(p.jerseyNo || '')) + '</td>' +
                '<td>' + escapeHtml(p.name || '') + '</td>' +
                '<td>' + ip + '</td>' +
                '<td>' + h + '</td>' +
                '<td>' + er + '</td>' +
                '<td>' + w + '</td>' +
                '<td>' + l + '</td>' +
                '<td>' + sv + '</td>' +
                '<td>' + escapeHtml(era) + '</td>' +
                '</tr>';
        }).join('');

        pitcherRecordTableBody.querySelectorAll('.pitcher-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var pid = el.getAttribute('data-player-id');
                if (pid) return openPitcherRecordModal(pid);
            }));
        });
    }

    async function renderPitcherRecordsToTbody(tbody, force) {
        if (!tbody) return;
        seedPlayersIfEmpty();
        var players = (await fetchPlayers(!!force)).filter(isPlayerForRecords);
        players.sort(function (a, b) { return toInt(a.jerseyNo) - toInt(b.jerseyNo); });
        var leagueId = getSelectedLeague();
        var records = pitcherRecordsForLeague(await fetchPitcherRecords(!!force), leagueId);
        var derived = await deriveRecordsFromGameLines(leagueId, !!force);
        if (derived.hasGameLines) records = derived.pitcher;
        var byId = {};
        records.forEach(function (r) { if (r && r.playerId) byId[String(r.playerId)] = r; });

        if (players.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="schedule-table-empty">활동 중인 선수가 없습니다.</td></tr>';
            return;
        }

        tbody.innerHTML = players.map(function (p) {
            var r = byId[p.id] || null;
            var ip = r ? parseFloat(String(r.ip || 0)) : 0;
            var h = r ? toInt(r.h) : 0;
            var er = r ? toInt(r.er) : 0;
            var w = r ? toInt(r.w) : 0;
            var l = r ? toInt(r.l) : 0;
            var sv = r ? toInt(r.sv) : 0;
            var era = r ? calcEra(r.er, r.ip) : '-';
            return '<tr class="schedule-table-row pitcher-full-row" data-player-id="' + escapeHtml(p.id) + '" title="더블클릭: 수정">' +
                '<td>' + escapeHtml(String(p.jerseyNo || '')) + '</td>' +
                '<td>' + escapeHtml(p.name || '') + '</td>' +
                '<td>' + ip + '</td>' +
                '<td>' + h + '</td>' +
                '<td>' + er + '</td>' +
                '<td>' + w + '</td>' +
                '<td>' + l + '</td>' +
                '<td>' + sv + '</td>' +
                '<td>' + escapeHtml(era) + '</td>' +
                '</tr>';
        }).join('');

        tbody.querySelectorAll('.pitcher-full-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var pid = el.getAttribute('data-player-id');
                if (!pid) return;
                closePitcherRecordListModal();
                return openPitcherRecordModal(pid);
            }));
        });
    }

    async function openPitcherRecordListModal() {
        await renderPitcherRecordsToTbody(pitcherRecordFullBody, false);
        openModal('pitcherRecordListModal');
    }

    function closePitcherRecordListModal() {
        closeModal('pitcherRecordListModal');
    }

    function closePitcherRecordModal() {
        closeModal('pitcherRecordModal');
    }

    async function openPitcherRecordModal(playerId) {
        seedPlayersIfEmpty();
        var leagueId = getSelectedLeague() || 'nono';
        var players = await fetchPlayers(false);
        var p = players.filter(function (x) { return x.id === playerId; })[0] || null;
        var records = await fetchPitcherRecords(false);
        if (pitchLeague) pitchLeague.value = leagueId;
        var r = playerId ? (records.filter(function (x) { return x && String(x.playerId) === String(playerId) && normalizeLeagueId(x.leagueId || 'nono') === normalizeLeagueId(leagueId); })[0] || null) : null;
        editingPitcherPlayerId = playerId || null;
        editingPitcherLeagueId = leagueId;
        if (pitcherRecordModalTitle) pitcherRecordModalTitle.textContent = playerId ? '투수기록 수정' : '투수기록 등록';
        if (pitcherRecordDeleteBtn) pitcherRecordDeleteBtn.style.display = playerId ? '' : 'none';

        if (pitchJerseyNo) pitchJerseyNo.value = p && p.jerseyNo !== undefined ? String(p.jerseyNo) : '';
        if (pitchName) pitchName.value = p ? (p.name || '') : '';
        if (pitchIp) pitchIp.value = r ? String(parseFloat(String(r.ip || 0))) : '0';
        if (pitchH) pitchH.value = r ? String(toInt(r.h)) : '0';
        if (pitchEr) pitchEr.value = r ? String(toInt(r.er)) : '0';
        if (pitchW) pitchW.value = r ? String(toInt(r.w)) : '0';
        if (pitchL) pitchL.value = r ? String(toInt(r.l)) : '0';
        if (pitchSv) pitchSv.value = r ? String(toInt(r.sv)) : '0';
        syncPitcherEra();
        openModal('pitcherRecordModal');
    }

    async function handlePitcherRecordSubmit(e) {
        e.preventDefault();
        seedPlayersIfEmpty();
        var leagueId = pitchLeague && pitchLeague.value ? normalizeLeagueId(pitchLeague.value) : (getSelectedLeague() || 'nono');
        var jersey = (pitchJerseyNo && pitchJerseyNo.value != null) ? String(pitchJerseyNo.value).trim() : '';
        var name = (pitchName && pitchName.value ? pitchName.value : '').trim();
        if (jersey === '') {
            alert('등번호를 입력해 주세요.');
            if (pitchJerseyNo) pitchJerseyNo.focus();
            return;
        }
        if (!name) {
            alert('성명을 입력해 주세요.');
            if (pitchName) pitchName.focus();
            return;
        }

        // 등번호 중복 방지(수정 시 본인은 제외)
        var pitchJerseyKey = normalizeJerseyNoForCompare(jersey);
        var pitchDupPlayers = isDbMode() ? await fetchPlayers(false) : getPlayers();
        var pitchDup = pitchDupPlayers.find(function (p) {
            if (!p) return false;
            if (editingPitcherPlayerId && String(p.id) === String(editingPitcherPlayerId)) return false;
            return normalizeJerseyNoForCompare(p.jerseyNo) === pitchJerseyKey;
        });
        if (pitchDup) {
            alert('이미 사용 중인 등번호입니다. (' + String(pitchDup.jerseyNo || '') + ' / ' + String(pitchDup.name || '') + ')');
            if (pitchJerseyNo) pitchJerseyNo.focus();
            return;
        }

        // 투수 이닝/수치 검증
        var ipParsed = parsePitchIp(pitchIp && pitchIp.value);
        if (!ipParsed.ok) {
            alert('이닝(IP) 형식이 올바르지 않습니다. 예: 5, 5.1(1/3), 5.2(2/3)');
            if (pitchIp) pitchIp.focus();
            return;
        }
        var h = toInt(pitchH && pitchH.value);
        var er = toInt(pitchEr && pitchEr.value);
        var w = toInt(pitchW && pitchW.value);
        var l = toInt(pitchL && pitchL.value);
        var sv = toInt(pitchSv && pitchSv.value);
        if (ipParsed.innings < 0 || h < 0 || er < 0 || w < 0 || l < 0 || sv < 0) {
            alert('기록 수치는 0 이상이어야 합니다.');
            return;
        }

        var players = isDbMode() ? await fetchPlayers(false) : getPlayers();
        var pid = editingPitcherPlayerId;
        if (!pid) {
            pid = 'p_' + Date.now();
            var newPlayer = { id: pid, jerseyNo: jersey, name: name, status: '활동', role: '4', contact: '' };
            if (isDbMode()) {
                await dbUpsertPlayer(Object.assign({ createdAt: Date.now() }, newPlayer));
                invalidateDbCache(['players']);
            } else {
                players.unshift(newPlayer);
                savePlayers(players);
            }
        } else {
            if (isDbMode()) {
                await dbUpsertPlayer({
                    id: pid,
                    jerseyNo: jersey,
                    name: name,
                    role: '4',
                    primaryPos: '',
                    secondaryPos: '',
                    status: '활동',
                    contact: '',
                    createdAt: Date.now()
                });
                invalidateDbCache(['players']);
            } else {
                var pidx = players.findIndex(function (x) { return x.id === pid; });
                if (pidx !== -1) {
                    players[pidx].jerseyNo = jersey;
                    players[pidx].name = name;
                    if (!players[pidx].status) players[pidx].status = '활동';
                    savePlayers(players);
                }
            }
        }

        syncPitcherEra();
        var rec = {
            leagueId: leagueId,
            playerId: pid,
            ip: ipParsed.ipForStore,
            h: h,
            er: er,
            w: w,
            l: l,
            sv: sv,
            updatedAt: Date.now()
        };
        if (isDbMode()) {
            await dbUpsertPitcherRecord(rec);
            invalidateDbCache(['pitcher']);
        } else {
            upsertPitcherRecord(leagueId, pid, rec);
        }
        await loadPitcherRecordsTable(true);
        await loadTeamRecordsTab(true);
        closePitcherRecordModal();
    }

    async function handlePitcherRecordDelete() {
        if (!editingPitcherPlayerId) return;
        if (!confirm('이 선수의 투수기록을 삭제하시겠습니까?')) return;
        await dbDeletePitcherRecord(editingPitcherLeagueId || (pitchLeague && pitchLeague.value) || 'nono', editingPitcherPlayerId);
        invalidateDbCache(['pitcher']);
        closePitcherRecordModal();
        await loadPitcherRecordsTable(true);
        await loadTeamRecordsTab(true);
        alert('삭제되었습니다.');
    }

    /** YYYY.MM.DD -> Date (local) */
    function parseNoticeDate(s) {
        if (!s) return null;
        var parts = String(s).replace(/\./g, '-').split('-');
        if (parts.length !== 3) return null;
        var y = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10) - 1;
        var d = parseInt(parts[2], 10);
        var dt = new Date(y, m, d);
        return isNaN(dt.getTime()) ? null : dt;
    }

    /** Date -> YYYY.MM.DD */
    function formatNoticeDate(d) {
        if (!d || !(d instanceof Date) || isNaN(d.getTime())) return '';
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var dd = String(d.getDate()).padStart(2, '0');
        return y + '.' + m + '.' + dd;
    }

    /** Date -> YYYY-MM-DD for input[type=date] */
    function toInputDate(d) {
        if (!d || !(d instanceof Date) || isNaN(d.getTime())) return '';
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function digitsOnly(s) {
        return String(s || '').replace(/\D/g, '');
    }

    function requireLogin(e) {
        if (isLoggedIn()) return true;
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        alert('로그인 후 이용 가능합니다.');
        openLoginModal();
        return false;
    }

    function withAuth(handler) {
        return function (e) {
            if (!requireLogin(e)) return;
            if (typeof handler === 'function') {
                try {
                    var r = handler(e);
                    if (r && typeof r.then === 'function') {
                        r.catch(function (err) {
                            console.error(err);
                            alert('처리 중 오류가 발생했습니다.');
                        });
                    }
                } catch (err) {
                    console.error(err);
                    alert('처리 중 오류가 발생했습니다.');
                }
            }
        };
    }

    function closeAllModals() {
        document.querySelectorAll('.modal.is-open').forEach(function (m) {
            m.classList.remove('is-open');
            m.setAttribute('aria-hidden', 'true');
        });
    }

    function showLoginMessage(msg, ok) {
        if (!loginMessage) return;
        var text = String(msg || '').trim();
        if (!text) {
            loginMessage.style.display = 'none';
            loginMessage.textContent = '';
            loginMessage.classList.remove('success');
            loginMessage.classList.remove('fail');
            return;
        }
        loginMessage.textContent = text;
        loginMessage.style.display = '';
        loginMessage.classList.toggle('success', !!ok);
        loginMessage.classList.toggle('fail', !ok);
    }

    function setLoginButtonState(loggedIn) {
        if (!loginBtn) return;
        if (loggedIn) {
            loginBtn.textContent = '로그아웃';
            loginBtn.setAttribute('title', '로그아웃');
            loginBtn.classList.add('is-logged-in');
        } else {
            loginBtn.textContent = '로그인';
            loginBtn.setAttribute('title', '로그인');
            loginBtn.classList.remove('is-logged-in');
        }
    }

    function refreshLoginUi() {
        setLoginButtonState(isLoggedIn());
        if (loginUserLabel) {
            if (isLoggedIn()) {
                var a = getAuth();
                var name = a && a.name ? String(a.name) : '';
                loginUserLabel.textContent = name ? (name + ' 님') : '로그인됨';
                loginUserLabel.style.display = '';
            } else {
                loginUserLabel.textContent = '';
                loginUserLabel.style.display = 'none';
            }
        }
        applyPermissionUi();
    }


    /** 성명이 "관리자"일 때만 이메일/비밀번호 입력란 활성화, 그 외에는 비우고 비활성화 */
    function applyLoginEmailFieldByRole() {
        var name = (loginName && loginName.value ? loginName.value : '').trim();
        var isAdmin = name === '관리자';
        if (loginEmail) {
            if (!isAdmin) loginEmail.value = '';
            setDisabled(loginEmail, !isAdmin, isAdmin ? '이메일' : '관리자만 이메일 로그인 가능');
        }
        if (loginPassword) {
            if (!isAdmin) loginPassword.value = '';
            setDisabled(loginPassword, !isAdmin, isAdmin ? '비밀번호' : '관리자만 이메일 로그인 가능');
        }
    }

    function openLoginModal() {
        var sbMode = isSupabaseReady();
        // Supabase 모드에서도 기본은 "간편 로그인(성명+뒤4자리)"를 유지하고
        // 필요시 이메일/비번 로그인(관리자/운영자용)을 사용할 수 있게 옵션으로 둠.
        if (loginLocalFields) loginLocalFields.style.display = '';
        if (loginSupabaseFields) loginSupabaseFields.style.display = sbMode ? '' : 'none';

        if (loginName) loginName.value = '';
        if (loginPhoneLast4) loginPhoneLast4.value = '';
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
        applyLoginEmailFieldByRole();
        showLoginMessage('', false);
        openModal('loginModal');
        if (loginName) loginName.focus();
    }

    function closeLoginModal() {
        showLoginMessage('', false);
        closeModal('loginModal');
    }

    async function refreshAllViews(force) {
        showLoadingOverlay();
        try {
            await loadTeamIntro(!!force);
            await loadNoticeList(!!force);
            await loadScheduleList(!!force);
            await loadSeasonScheduleTable(!!force);
            await loadSeasonStats(!!force);
            await loadPersonalRecordsTable(!!force);
            await loadPitcherRecordsTable(!!force);
            await loadTeamRecordsTab(!!force);
            await loadPlayerTable(!!force);
            await loadMediaList(!!force);
            await loadCommunityList(!!force);
            await loadGalleryGrid(!!force);
        } finally {
            hideLoadingOverlay();
        }
    }

    function logout() {
        // Supabase 모드면 서버 세션도 종료
        if (isSupabaseReady()) {
            try {
                initSupabase();
                sb.auth.signOut().catch(function (err) { console.error(err); });
            } catch (e) { /* ignore */ }
        }
        clearAuth();
        invalidateDbCache();
        refreshLoginUi();
        applyPermissionUi();
        closeAllModals();
        // 화면도 빈 상태로 갱신
        refreshAllViews(false).catch(console.error);
        alert('로그아웃되었습니다.');
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        // Supabase 모드: 이메일/비밀번호 로그인 + user_profiles role 기반 권한
        if (isSupabaseReady()) {
            initSupabase();
            try {
                // 1) 이메일/비번 입력이 있으면 해당 방식 우선
                var email = (loginEmail && loginEmail.value ? loginEmail.value : '').trim();
                var pw = (loginPassword && loginPassword.value ? loginPassword.value : '').trim();
                if (email && pw) {
                    var res = await sb.auth.signInWithPassword({ email: email, password: pw });
                    if (res.error) throw res.error;
                    var prof = await sb.from('user_profiles').select('role, player_id').eq('id', res.data.user.id).maybeSingle();
                    var role = prof.data && prof.data.role ? String(prof.data.role) : '4';
                    var playerId = prof.data && prof.data.player_id ? String(prof.data.player_id) : null;
                    setAuth({ loggedIn: true, playerId: playerId, name: email, role: role, at: Date.now() });
                    invalidateDbCache();
                    refreshLoginUi();
                    await refreshAllViews(true);
                    alert('성공');
                    closeLoginModal();
                    return;
                }

                // 2) 간편 로그인(성명 + 뒤4자리) -> 선수 매칭 -> Auth 계정 자동 생성/매칭
                var name = (loginName && loginName.value ? loginName.value : '').trim();
                var last4Raw = (loginPhoneLast4 && loginPhoneLast4.value ? loginPhoneLast4.value : '').trim();
                var last4 = digitsOnly(last4Raw);
                if (!name) {
                    alert('성명을 입력해 주세요.');
                    if (loginName) loginName.focus();
                    return;
                }
                if (last4.length !== 4) {
                    alert('전화번호 뒤 4자리를 정확히 입력해 주세요.');
                    if (loginPhoneLast4) loginPhoneLast4.focus();
                    return;
                }

                // (1) 선수단에서 매칭 (RPC는 anon도 가능)
                var match = await sb.rpc('lookup_player_login', { p_name: name, p_last4: last4 });
                if (match.error) throw match.error;
                var m = match.data && match.data[0] ? match.data[0] : null;
                if (!m || !m.player_id) {
                    showLoginMessage('선수단 정보와 일치하지 않습니다.', false);
                    return;
                }

                // 내부 이메일/패스워드 규칙(간편 로그인용)
                var internalEmail = 'player_' + String(m.player_id) + '@yagubu.local';
                // NOTE:
                // 과거에는 password를 last4 기반으로 썼는데, 선수 연락처가 바뀌면 기존 계정 로그인 불가가 발생할 수 있음.
                // 그래서 "검증은 last4로 하고", Auth 계정 password는 player_id 기반의 안정적인 값으로 통일한다.
                // (기존(last4) 비번으로 로그인이 되는 경우에는 즉시 새 비번으로 마이그레이션)
                var stablePw = 'yagubu_' + String(m.player_id);
                var legacyPw = 'yagubu_' + last4;

                // (2) 로그인 시도: stable -> legacy -> signUp(stable)
                var signIn = await sb.auth.signInWithPassword({ email: internalEmail, password: stablePw });
                if (signIn.error) {
                    var signInLegacy = await sb.auth.signInWithPassword({ email: internalEmail, password: legacyPw });
                    if (signInLegacy.error) {
                        // 계정이 없으면 자동 생성 (stablePw)
                        var signUp = await sb.auth.signUp({ email: internalEmail, password: stablePw });
                        if (signUp.error) throw signUp.error;

                        // 이메일 확인이 켜져 있으면 세션이 바로 안 나올 수 있음 → 다시 로그인 시도
                        var signIn2 = await sb.auth.signInWithPassword({ email: internalEmail, password: stablePw });
                        if (signIn2.error) throw signIn2.error;
                    } else {
                        // legacy로 로그인 성공 → stablePw로 즉시 마이그레이션(본인 계정 비번 변경)
                        try {
                            await sb.auth.updateUser({ password: stablePw });
                        } catch (e2) {
                            // ignore: 다음 로그인부터 stablePw가 적용되지 않을 수 있으나, legacy로는 계속 가능
                        }
                    }
                }

                // (3) 프로필에 player_id/role 연결(서버에서 강제)
                var linked = await sb.rpc('link_my_profile', { p_player_id: String(m.player_id) });
                // linked.data = role(string)
                var role = linked.data ? String(linked.data) : (m.role ? String(m.role) : '4');
                setAuth({ loggedIn: true, playerId: String(m.player_id), name: name, role: role, at: Date.now() });
                invalidateDbCache();
                refreshLoginUi();
                await refreshAllViews(true);
                alert('성공');
                closeLoginModal();
            } catch (err) {
                console.error(err);
                var msg = '로그인 실패: 정보를 확인해 주세요.';
                try {
                    var em = err && err.message ? String(err.message) : '';
                    if (em) msg = '로그인 실패: ' + em;
                } catch (e3) { /* ignore */ }
                showLoginMessage(msg, false);
            }
            return;
        }

        // localStorage 모드: 기존 성명/전화번호 뒤4자리 로그인
        seedPlayersIfEmpty();

        var name = (loginName && loginName.value ? loginName.value : '').trim();
        var last4Raw = (loginPhoneLast4 && loginPhoneLast4.value ? loginPhoneLast4.value : '').trim();
        var last4 = digitsOnly(last4Raw);

        if (!name) {
            alert('성명을 입력해 주세요.');
            if (loginName) loginName.focus();
            return;
        }
        if (last4.length !== 4) {
            alert('전화번호 뒤 4자리를 정확히 입력해 주세요.');
            if (loginPhoneLast4) loginPhoneLast4.focus();
            return;
        }

        var players = getPlayers();
        var matched = players.filter(function (p) {
            var pName = (p && p.name ? String(p.name) : '').trim();
            if (pName !== name) return false;
            var stat = p && p.status ? p.status : '활동';
            if (stat === '탈퇴') return false;
            var c = digitsOnly(p && p.contact ? p.contact : '');
            if (c.length < 4) return false;
            return c.slice(-4) === last4;
        })[0];

        if (matched) {
            showLoginMessage('성공', true);
            setAuth({ loggedIn: true, playerId: matched.id || null, name: matched.name || name, role: matched.role || '4', at: Date.now() });
            refreshLoginUi();
            alert('성공');
            closeLoginModal();
        } else {
            showLoginMessage('선수단 정보와 일치하지 않습니다.', false);
        }
    }

    function openModal(id) {
        var el = document.getElementById(id);
        if (el) {
            el.classList.add('is-open');
            el.setAttribute('aria-hidden', 'false');
        }
    }

    function closeModal(id) {
        var el = document.getElementById(id);
        if (el) {
            el.classList.remove('is-open');
            el.setAttribute('aria-hidden', 'true');
        }
    }

    function showLoadingOverlay() {
        var el = document.getElementById('globalLoadingOverlay');
        if (el) {
            el.classList.add('active');
            el.setAttribute('aria-hidden', 'false');
        }
    }

    function hideLoadingOverlay() {
        var el = document.getElementById('globalLoadingOverlay');
        if (el) {
            el.classList.remove('active');
            el.setAttribute('aria-hidden', 'true');
        }
    }

    function closeCommunityAddModal() {
        editingCommunityId = null;
        if (communityDeleteBtn) communityDeleteBtn.style.display = 'none';
        if (communityModalTitle) communityModalTitle.textContent = '커뮤니티 글쓰기';
        closeModal('communityAddModal');
    }

    function closeCommunityListModal() {
        closeModal('communityListModal');
    }

    function closeCommunityViewModal() {
        viewingCommunityId = null;
        communityNavIds = [];
        communityNavIndex = -1;
        closeModal('communityViewModal');
    }

    /** 태그 문자열(쉼표 구분) -> 배열 (공백 제거, 빈 문자열 제외) */
    function parseTags(s) {
        if (typeof s !== 'string') return [];
        return s.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }

    /** 앨범/태그 필터 적용 */
    function filterGalleryByAlbumTag(list, albumValue, tagValue) {
        if (!list || !list.length) return list;
        var filtered = list;
        if (albumValue) {
            filtered = filtered.filter(function (it) { return (it.albumName || '') === albumValue; });
        }
        if (tagValue) {
            filtered = filtered.filter(function (it) {
                var tags = parseTags(it.tags || '');
                return tags.indexOf(tagValue) !== -1;
            });
        }
        return filtered;
    }

    /** 목록에서 고유 앨범명·태그 수집 */
    function collectGalleryFilterOptions(list) {
        var albums = new Set();
        var tags = new Set();
        (list || []).forEach(function (it) {
            var an = (it.albumName || '').trim();
            if (an) albums.add(an);
            parseTags(it.tags || '').forEach(function (t) { tags.add(t); });
        });
        return { albums: Array.from(albums).sort(), tags: Array.from(tags).sort() };
    }

    function closeGalleryAddModal() {
        editingGalleryId = null;
        if (galleryDeleteBtn) galleryDeleteBtn.style.display = 'none';
        if (galleryModalTitle) galleryModalTitle.textContent = '팀활동 갤러리 등록';
        if (galleryAddForm) galleryAddForm.reset();
        if (galleryPhotoPreview) galleryPhotoPreview.style.display = 'none';
        if (galleryPhotoPreviewImg) galleryPhotoPreviewImg.src = '';
        closeModal('galleryAddModal');
    }

    function closeGalleryListModal() {
        closeModal('galleryListModal');
    }

    function closeGalleryViewModal() {
        viewingGalleryId = null;
        closeModal('galleryViewModal');
    }

    function setCommunityNavContext(ids, currentId) {
        communityNavIds = Array.isArray(ids) ? ids.filter(Boolean) : [];
        communityNavIndex = -1;
        if (!currentId) return;
        for (var i = 0; i < communityNavIds.length; i++) {
            if (String(communityNavIds[i]) === String(currentId)) {
                communityNavIndex = i;
                break;
            }
        }
    }

    function updateCommunityNavButtons() {
        var hasPrev = communityNavIndex > 0;
        var hasNext = communityNavIndex >= 0 && communityNavIndex < (communityNavIds.length - 1);
        setDisabled(communityPrevBtn, !hasPrev, hasPrev ? '이전 글' : '이전 글 없음');
        setDisabled(communityNextBtn, !hasNext, hasNext ? '다음 글' : '다음 글 없음');
    }

    function fmtTs(ms) {
        var d = ms ? new Date(ms) : null;
        if (!d || isNaN(d.getTime())) return '';
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var dd = String(d.getDate()).padStart(2, '0');
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        return y + '-' + m + '-' + dd + ' ' + hh + ':' + mm;
    }

    function isCommentAuthor(c, currentUid) {
        if (!c || !isLoggedIn()) return false;
        var a = getAuth();
        var myName = a && a.name ? String(a.name) : '';
        var myPlayerId = a && a.playerId ? String(a.playerId) : '';
        if (currentUid && c.authorUserId && String(c.authorUserId) === String(currentUid)) return true;
        if (myPlayerId && c.authorPlayerId && String(c.authorPlayerId) === String(myPlayerId)) return true;
        if (myName && c.authorName && String(c.authorName) === String(myName)) return true;
        return false;
    }

    function canDeleteComment(c, currentUid) {
        if (!isLoggedIn()) return false;
        if (canManage()) return true;
        return isCommentAuthor(c, currentUid);
    }

    async function loadCommunityComments(postId) {
        if (!communityCommentsList) return;
        communityCommentsList.innerHTML = '';
        if (!postId) return;
        var uid = await getCurrentSupabaseUserId();
        var list = await dbListCommunityComments(postId);
        if (communityCommentsCount) communityCommentsCount.textContent = String(list.length || 0);
        if (!list || list.length === 0) {
            communityCommentsList.innerHTML = '<div class="community-empty">댓글이 없습니다.</div>';
            return;
        }
        communityCommentsList.innerHTML = list.map(function (c) {
            var meta = (c.authorName ? escapeHtml(c.authorName) : '-') + ' · ' + escapeHtml(fmtTs(c.createdAt));
            var del = canDeleteComment(c, uid) ? ('<button type="button" class="community-comment-delete" data-comment-id="' + escapeHtml(String(c.id || '')) + '">삭제</button>') : '';
            return '<div class="community-comment-item">' +
                '<div class="community-comment-meta"><span>' + meta + '</span>' + del + '</div>' +
                '<div class="community-comment-content">' + escapeHtml(c.content || '') + '</div>' +
                '</div>';
        }).join('');

        communityCommentsList.querySelectorAll('[data-comment-id]').forEach(function (btn) {
            btn.addEventListener('click', withAuth(function (e) {
                if (e && e.preventDefault) e.preventDefault();
                var id = btn.getAttribute('data-comment-id');
                if (!id) return;
                return handleCommunityCommentDelete(id);
            }));
        });
    }

    async function handleCommunityCommentSubmit(e) {
        e.preventDefault();
        if (!viewingCommunityId) return;
        var text = (communityCommentText && communityCommentText.value ? communityCommentText.value : '').trim();
        if (!text) {
            alert('댓글을 입력해 주세요.');
            if (communityCommentText) communityCommentText.focus();
            return;
        }
        if (byteLen(text) > 1000) {
            alert('댓글은 1000BYTE 이내로 입력해 주세요.');
            if (communityCommentText) communityCommentText.focus();
            return;
        }
        var a = getAuth();
        var authorName = a && a.name ? String(a.name) : '';
        var authorPlayerId = a && a.playerId ? String(a.playerId) : null;
        var authorUserId = await getCurrentSupabaseUserId();

        var c = {
            id: 'cc_' + Date.now(),
            postId: viewingCommunityId,
            authorName: authorName,
            authorPlayerId: authorPlayerId,
            authorUserId: authorUserId,
            content: text,
            createdAt: Date.now()
        };
        await dbInsertCommunityComment(c);
        if (communityCommentText) communityCommentText.value = '';
        await loadCommunityComments(viewingCommunityId);
        // 댓글 수 표시(리스트) 즉시 갱신
        await loadCommunityList(true);
        if (document.getElementById('communityListModal') && document.getElementById('communityListModal').classList.contains('is-open')) {
            await runCommunitySearch();
        }
    }

    async function handleCommunityCommentDelete(commentId) {
        if (!commentId) return;
        var uid = await getCurrentSupabaseUserId();
        var list = await dbListCommunityComments(viewingCommunityId);
        var c = (list || []).filter(function (x) { return x && String(x.id) === String(commentId); })[0] || null;
        if (!c) return;
        if (!canDeleteComment(c, uid)) {
            alert('권한이 없습니다. (작성자 또는 스텝만 가능)');
            return;
        }
        if (!confirm('댓글을 삭제하시겠습니까?')) return;
        await dbDeleteCommunityComment(commentId);
        await loadCommunityComments(viewingCommunityId);
        // 댓글 수 표시(리스트) 즉시 갱신
        await loadCommunityList(true);
        if (document.getElementById('communityListModal') && document.getElementById('communityListModal').classList.contains('is-open')) {
            await runCommunitySearch();
        }
    }

    async function getCurrentSupabaseUserId() {
        if (!isSupabaseReady()) return null;
        try {
            initSupabase();
            var sess = await sb.auth.getSession();
            return sess && sess.data && sess.data.session && sess.data.session.user ? sess.data.session.user.id : null;
        } catch (e) {
            return null;
        }
    }

    /** 로그인한 사용자 식별자 (좋아요용). Supabase면 uuid, 로컬이면 'local_'+playerId 등 */
    function getCurrentUserLikeId() {
        if (!isLoggedIn()) return null;
        if (isSupabaseReady()) return null; /* 비동기로 getCurrentSupabaseUserId 사용 */
        var a = getAuth();
        var key = (a && (a.playerId || a.email || a.name)) ? String(a.playerId || a.email || a.name) : '';
        return key ? 'local_' + key : null;
    }

    /** 로컬: 글 ID별 좋아요 개수 */
    function getCommunityLikeCountMapLocal(postIds) {
        var ids = (postIds || []).map(String).filter(Boolean);
        var map = {};
        ids.forEach(function (id) { map[id] = 0; });
        getCommunityLikes().forEach(function (x) {
            if (!x || !x.postId) return;
            var pid = String(x.postId);
            if (map[pid] !== undefined) map[pid]++;
        });
        return map;
    }

    /** 로컬: 내가 좋아요한 글 ID 집합 */
    function getCommunityLikedByMeLocal(postIds) {
        var my = getCurrentUserLikeId();
        if (!my) return new Set();
        var set = new Set();
        getCommunityLikes().forEach(function (x) {
            if (!x || x.userId !== my) return;
            if (postIds && postIds.length) {
                if (postIds.indexOf(x.postId) !== -1 || postIds.indexOf(String(x.postId)) !== -1) set.add(String(x.postId));
            } else set.add(String(x.postId));
        });
        return set;
    }

    /** Supabase: 내가 좋아요한 글 ID 집합 */
    async function dbGetCommunityLikedByMe(postIds) {
        var ids = (postIds || []).map(String).filter(Boolean);
        if (ids.length === 0 || !isSupabaseReady()) return new Set();
        var uid = await getCurrentSupabaseUserId();
        if (!uid) return new Set();
        var client = ensureSb();
        var res = await client.from('community_post_likes').select('post_id').eq('user_id', uid).in('post_id', ids);
        if (res.error) return new Set();
        var set = new Set();
        (res.data || []).forEach(function (r) {
            if (r && r.post_id) set.add(String(r.post_id));
        });
        return set;
    }

    /** 좋아요 토글. 로그인 필요 */
    async function toggleCommunityLike(postId) {
        if (!postId || !isLoggedIn()) return { likeCount: 0, likedByMe: false };
        if (isSupabaseReady()) {
            var uid = await getCurrentSupabaseUserId();
            if (!uid) return null;
            var client = ensureSb();
            var exist = await client.from('community_post_likes').select('post_id').eq('post_id', postId).eq('user_id', uid).maybeSingle();
            if (exist.error) return null;
            if (exist.data) {
                await client.from('community_post_likes').delete().eq('post_id', postId).eq('user_id', uid);
            } else {
                await client.from('community_post_likes').insert({ post_id: postId, user_id: uid });
            }
            var row = await client.from('community_posts').select('like_count').eq('id', postId).single();
            var likeCount = row && row.data && (row.data.like_count !== undefined) ? parseInt(row.data.like_count, 10) : 0;
            var liked = !exist.data;
            return { likeCount: likeCount, likedByMe: liked };
        }
        var my = getCurrentUserLikeId();
        if (!my) return null;
        var arr = getCommunityLikes();
        var idx = arr.findIndex(function (x) { return x && String(x.postId) === String(postId) && x.userId === my; });
        if (idx >= 0) {
            arr.splice(idx, 1);
        } else {
            arr.push({ postId: String(postId), userId: my });
        }
        saveCommunityLikes(arr);
        var map = getCommunityLikeCountMapLocal([postId]);
        var set = getCommunityLikedByMeLocal([postId]);
        return { likeCount: map[postId] || 0, likedByMe: set.has(String(postId)) };
    }

    /** 글 목록용: likeCount / likedByMe 병합 (로컬이면 count·set 적용, Supabase면 likedByMe만 조회 후 병합) */
    async function mergeCommunityLikes(list) {
        if (!list || !list.length) return list;
        var ids = list.map(function (p) { return p && p.id ? String(p.id) : ''; }).filter(Boolean);
        var countMap = {};
        var likedSet = new Set();
        if (isSupabaseReady()) {
            ids.forEach(function (id) { countMap[id] = 0; });
            list.forEach(function (p) {
                if (p && p.likeCount !== undefined) countMap[String(p.id)] = p.likeCount || 0;
            });
            likedSet = await dbGetCommunityLikedByMe(ids);
        } else {
            countMap = getCommunityLikeCountMapLocal(ids);
            likedSet = getCommunityLikedByMeLocal(ids);
        }
        list.forEach(function (p) {
            if (!p) return;
            var id = String(p.id || '');
            p.likeCount = countMap[id] !== undefined ? countMap[id] : (p.likeCount || 0);
            p.likedByMe = likedSet.has(id);
        });
        return list;
    }

    function isCommunityAuthor(post, currentUid) {
        if (!post || !isLoggedIn()) return false;
        var a = getAuth();
        var myName = a && a.name ? String(a.name) : '';
        var myPlayerId = a && a.playerId ? String(a.playerId) : '';
        if (currentUid && post.authorUserId && String(post.authorUserId) === String(currentUid)) return true;
        if (myPlayerId && post.authorPlayerId && String(post.authorPlayerId) === String(myPlayerId)) return true;
        if (myName && post.authorName && String(post.authorName) === String(myName)) return true;
        return false;
    }

    function canEditOrDeleteCommunity(post, currentUid) {
        if (!isLoggedIn()) return false;
        if (canManage()) return true;
        return isCommunityAuthor(post, currentUid);
    }

    function isGalleryAuthor(item, currentUid) {
        if (!item || !isLoggedIn()) return false;
        var a = getAuth();
        var myName = a && a.name ? String(a.name) : '';
        var myPlayerId = a && a.playerId ? String(a.playerId) : '';
        if (currentUid && item.authorUserId && String(item.authorUserId) === String(currentUid)) return true;
        if (myPlayerId && item.authorPlayerId && String(item.authorPlayerId) === String(myPlayerId)) return true;
        if (myName && item.authorName && String(item.authorName) === String(myName)) return true;
        return false;
    }

    function canEditOrDeleteGallery(item, currentUid) {
        if (!isLoggedIn()) return false;
        if (canManage()) return true;
        return isGalleryAuthor(item, currentUid);
    }

    async function findCommunityPostById(id, force) {
        if (!id) return null;
        var list = await fetchCommunityPosts(!!force);
        return (list || []).filter(function (p) { return p && p.id === id; })[0] || null;
    }

    async function findGalleryItemById(id, force) {
        if (!id) return null;
        var list = await fetchGalleryItems(!!force);
        return (list || []).filter(function (x) { return x && x.id === id; })[0] || null;
    }

    function byteLen(str) {
        try {
            return new Blob([str || '']).size;
        } catch (e) {
            // fallback (대략치)
            return String(str || '').length;
        }
    }

    function nowHHMM() {
        var d = new Date();
        var h = String(d.getHours()).padStart(2, '0');
        var m = String(d.getMinutes()).padStart(2, '0');
        return h + ':' + m;
    }

    function fileToDataUrl(file) {
        return new Promise(function (resolve, reject) {
            if (!file) return resolve('');
            var reader = new FileReader();
            reader.onload = function () { resolve(String(reader.result || '')); };
            reader.onerror = function (e) { reject(e); };
            reader.readAsDataURL(file);
        });
    }

    function openGalleryAddModal() {
        var a = getAuth();
        if (galleryAuthor) galleryAuthor.value = a && a.name ? String(a.name) : '';
        if (galleryDate) galleryDate.value = toInputDate(new Date());
        if (galleryTime) galleryTime.value = nowHHMM();
        if (galleryShortText) galleryShortText.value = '';
        if (galleryContent) galleryContent.value = '';
        if (galleryEventDate) galleryEventDate.value = '';
        if (galleryAlbumName) galleryAlbumName.value = '';
        if (galleryTags) galleryTags.value = '';
        editingGalleryId = null;
        if (galleryDeleteBtn) galleryDeleteBtn.style.display = 'none';
        if (galleryModalTitle) galleryModalTitle.textContent = '팀활동 갤러리 등록';
        if (galleryPhotoFile) galleryPhotoFile.value = '';
        if (galleryPhotoPreview) galleryPhotoPreview.style.display = 'none';
        if (galleryPhotoPreviewImg) galleryPhotoPreviewImg.src = '';
        openModal('galleryAddModal');
    }

    async function openGalleryEditModal(id) {
        var it = await findGalleryItemById(id, false);
        if (!it) return;
        var uid = await getCurrentSupabaseUserId();
        if (!canEditOrDeleteGallery(it, uid)) {
            alert('권한이 없습니다. (등록자 또는 스텝만 가능)');
            return;
        }
        editingGalleryId = it.id;
        if (galleryModalTitle) galleryModalTitle.textContent = '팀활동 갤러리 수정';
        if (galleryDeleteBtn) galleryDeleteBtn.style.display = '';
        if (galleryAuthor) galleryAuthor.value = it.authorName || '';
        if (galleryDate) galleryDate.value = it.date || toInputDate(new Date());
        if (galleryTime) galleryTime.value = it.time || nowHHMM();
        if (galleryShortText) galleryShortText.value = it.shortText || '';
        if (galleryContent) galleryContent.value = it.content || '';
        if (galleryEventDate) galleryEventDate.value = it.eventDate || '';
        if (galleryAlbumName) galleryAlbumName.value = it.albumName || '';
        if (galleryTags) galleryTags.value = it.tags || '';
        if (galleryPhotoFile) galleryPhotoFile.value = '';
        if (galleryPhotoPreviewImg) galleryPhotoPreviewImg.src = it.imageData || '';
        if (galleryPhotoPreview) galleryPhotoPreview.style.display = (it.imageData ? '' : 'none');
        openModal('galleryAddModal');
    }

    async function openGalleryViewModal(id) {
        var it = await findGalleryItemById(id, false);
        if (!it) return;
        viewingGalleryId = it.id;
        var meta = (it.date || '') + (it.time ? (' ' + it.time) : '');
        if (it.authorName) meta += ' · ' + it.authorName;
        if (it.albumName || it.tags) {
            var extra = [];
            if (it.albumName) extra.push('앨범: ' + it.albumName);
            if (it.tags) extra.push('태그: ' + it.tags);
            meta += (extra.length ? ' · ' + extra.join(' / ') : '');
        }
        if (galleryViewMeta) galleryViewMeta.textContent = meta || '-';
        if (galleryViewShort) galleryViewShort.textContent = it.shortText || '';
        if (galleryViewContent) galleryViewContent.textContent = it.content || '';
        if (galleryViewImg) galleryViewImg.src = it.imageData || '';

        var uid = await getCurrentSupabaseUserId();
        var allow = canEditOrDeleteGallery(it, uid);
        setDisabled(galleryViewEditBtn, !allow, allow ? '수정' : '등록자 또는 스텝만 가능');
        setDisabled(galleryViewDeleteBtn, !allow, allow ? '삭제' : '등록자 또는 스텝만 가능');
        if (galleryViewDownloadBtn) galleryViewDownloadBtn.disabled = !it.imageData;
        openModal('galleryViewModal');
    }

    function safeFilenamePart(s) {
        return String(s || '')
            .replace(/[\\\/:*?"<>|]/g, '_')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 60);
    }

    function dataUrlToBlob(dataUrl) {
        var parts = String(dataUrl || '').split(',');
        if (parts.length < 2) return null;
        var meta = parts[0] || '';
        var b64 = parts[1] || '';
        var mimeMatch = meta.match(/data:([^;]+);base64/i);
        var mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        var bin = atob(b64);
        var len = bin.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
        return new Blob([bytes], { type: mime });
    }

    async function downloadGalleryViewingImage() {
        if (!viewingGalleryId) return;
        var it = await findGalleryItemById(viewingGalleryId, false);
        if (!it || !it.imageData) { alert('다운로드할 이미지가 없습니다.'); return; }

        var baseName = safeFilenamePart(it.title || it.shortText || 'YAGUBU_GALLERY');
        var datePart = safeFilenamePart(it.date || '');
        var filenameBase = (datePart ? (datePart + '_' + baseName) : baseName) || 'YAGUBU_GALLERY';

        try {
            var href = it.imageData;
            var isDataUrl = /^data:/i.test(href);
            if (isDataUrl) {
                var blob = dataUrlToBlob(href);
                if (!blob) throw new Error('이미지 변환 실패');
                var ext = (blob.type === 'image/png') ? 'png' : (blob.type === 'image/jpeg') ? 'jpg' : (blob.type === 'image/gif') ? 'gif' : 'png';
                var url = URL.createObjectURL(blob);
                try {
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = filenameBase + '.' + ext;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } finally {
                    setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 3000);
                }
                return;
            }

            // URL인 경우: 새 탭 열기(다운로드 속성은 크로스오리진 제한 가능)
            window.open(href, '_blank', 'noopener');
        } catch (e) {
            alert('다운로드에 실패했습니다: ' + (e && e.message ? e.message : String(e)));
        }
    }

    function setGalleryFilterSelect(selectEl, options, currentValue) {
        if (!selectEl) return;
        var val = currentValue || '';
        selectEl.innerHTML = '<option value="">전체</option>' + options.map(function (o) {
            return '<option value="' + escapeHtml(o) + '"' + (val === o ? ' selected' : '') + '>' + escapeHtml(o) + '</option>';
        }).join('');
        if (val && options.indexOf(val) === -1) selectEl.value = '';
    }

    async function loadGalleryGrid(force) {
        if (!galleryGrid) return;
        var raw = await fetchGalleryItems(!!force);
        var list = (raw || []).slice();
        var opts = collectGalleryFilterOptions(list);
        if (galleryFilterAlbum) setGalleryFilterSelect(galleryFilterAlbum, opts.albums, galleryFilterAlbum.value);
        if (galleryFilterTag) setGalleryFilterSelect(galleryFilterTag, opts.tags, galleryFilterTag.value);
        var albumVal = galleryFilterAlbum && galleryFilterAlbum.value ? galleryFilterAlbum.value : '';
        var tagVal = galleryFilterTag && galleryFilterTag.value ? galleryFilterTag.value : '';
        list = filterGalleryByAlbumTag(list, albumVal, tagVal);
        list.sort(function (a, b) {
            var ak = String(a.date || '') + ' ' + String(a.time || '');
            var bk = String(b.date || '') + ' ' + String(b.time || '');
            return bk.localeCompare(ak);
        });
        var show = list.slice(0, 8);
        if (show.length === 0) {
            galleryGrid.innerHTML = '<div class="gallery-empty">아직 등록된 사진이 없습니다.</div>';
            return;
        }
        galleryGrid.innerHTML = show.map(function (it) {
            var short = it.shortText ? escapeHtml(it.shortText) : '';
            return '<div class="gallery-item" data-gallery-id="' + escapeHtml(String(it.id || '')) + '">' +
                '<div class="gallery-thumb"><img src="' + escapeHtml(it.imageData || '') + '" alt="" /></div>' +
                '<div class="gallery-caption">' + short + '</div>' +
                '</div>';
        }).join('');
        galleryGrid.querySelectorAll('[data-gallery-id]').forEach(function (el) {
            el.addEventListener('click', withAuth(function (e) {
                if (e && e.preventDefault) e.preventDefault();
                var id = el.getAttribute('data-gallery-id');
                if (!id) return;
                return openGalleryViewModal(id);
            }));
        });
    }

    async function openGalleryListModal() {
        if (galleryListFilterAlbum) galleryListFilterAlbum.value = '';
        if (galleryListFilterTag) galleryListFilterTag.value = '';
        await loadGalleryFullGrid(false);
        openModal('galleryListModal');
    }

    async function loadGalleryFullGrid(force) {
        if (!galleryFullGrid) return;
        var raw = await fetchGalleryItems(!!force);
        var list = (raw || []).slice();
        var opts = collectGalleryFilterOptions(list);
        if (galleryListFilterAlbum) setGalleryFilterSelect(galleryListFilterAlbum, opts.albums, galleryListFilterAlbum.value);
        if (galleryListFilterTag) setGalleryFilterSelect(galleryListFilterTag, opts.tags, galleryListFilterTag.value);
        var albumVal = galleryListFilterAlbum && galleryListFilterAlbum.value ? galleryListFilterAlbum.value : '';
        var tagVal = galleryListFilterTag && galleryListFilterTag.value ? galleryListFilterTag.value : '';
        list = filterGalleryByAlbumTag(list, albumVal, tagVal);
        list.sort(function (a, b) {
            var ak = String(a.date || '') + ' ' + String(a.time || '');
            var bk = String(b.date || '') + ' ' + String(b.time || '');
            return bk.localeCompare(ak);
        });
        if (list.length === 0) {
            galleryFullGrid.innerHTML = '<div class="gallery-empty">조건에 맞는 사진이 없습니다.</div>';
            return;
        }
        galleryFullGrid.innerHTML = list.map(function (it) {
            var dt = (it.date || '') + (it.time ? (' ' + it.time) : '');
            var who = it.authorName ? (' · ' + escapeHtml(it.authorName)) : '';
            var short = it.shortText ? escapeHtml(it.shortText) : '';
            return '<div class="gallery-full-item" data-gallery-id="' + escapeHtml(String(it.id || '')) + '">' +
                '<div class="gallery-thumb"><img src="' + escapeHtml(it.imageData || '') + '" alt="" /></div>' +
                '<div class="gallery-full-meta">' + escapeHtml(dt) + who + '</div>' +
                '<div class="gallery-full-short">' + short + '</div>' +
                '</div>';
        }).join('');
        galleryFullGrid.querySelectorAll('[data-gallery-id]').forEach(function (el) {
            el.addEventListener('click', withAuth(function (e) {
                if (e && e.preventDefault) e.preventDefault();
                var id = el.getAttribute('data-gallery-id');
                if (!id) return;
                closeGalleryListModal();
                return openGalleryViewModal(id);
            }));
            el.addEventListener('dblclick', withAuth(function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                var id = el.getAttribute('data-gallery-id');
                if (!id) return;
                closeGalleryListModal();
                return openGalleryEditModal(id);
            }));
        });
    }

    async function handleGalleryAddSubmit(e) {
        e.preventDefault();
        var dateVal = galleryDate && galleryDate.value ? galleryDate.value : '';
        var timeVal = galleryTime && galleryTime.value ? galleryTime.value : '';
        var shortText = (galleryShortText && galleryShortText.value ? galleryShortText.value : '').trim();
        var content = (galleryContent && galleryContent.value ? galleryContent.value : '').trim();
        if (!dateVal) { alert('작성일을 선택해 주세요.'); if (galleryDate) galleryDate.focus(); return; }
        if (!timeVal) { alert('작성 시간을 입력해 주세요.'); if (galleryTime) galleryTime.focus(); return; }
        if (shortText.length > 30) { alert('짧은글은 30자 이내로 입력해 주세요.'); if (galleryShortText) galleryShortText.focus(); return; }

        var a = getAuth();
        var authorName = a && a.name ? String(a.name) : '';
        var authorPlayerId = a && a.playerId ? String(a.playerId) : null;
        var authorUserId = await getCurrentSupabaseUserId();

        var imageData = '';
        var file = galleryPhotoFile && galleryPhotoFile.files && galleryPhotoFile.files[0] ? galleryPhotoFile.files[0] : null;
        if (file) imageData = await fileToDataUrl(file);

        var it = null;
        if (editingGalleryId) {
            var existing = await findGalleryItemById(editingGalleryId, false);
            if (!existing) { alert('수정 대상 항목을 찾을 수 없습니다.'); return; }
            var uid = await getCurrentSupabaseUserId();
            if (!canEditOrDeleteGallery(existing, uid)) { alert('권한이 없습니다. (등록자 또는 스텝만 가능)'); return; }
            it = Object.assign({}, existing, {
                date: dateVal,
                time: timeVal,
                shortText: shortText,
                content: content,
                imageData: imageData || existing.imageData,
                eventDate: galleryEventDate && galleryEventDate.value ? galleryEventDate.value : '',
                albumName: galleryAlbumName && galleryAlbumName.value ? galleryAlbumName.value.trim() : '',
                tags: galleryTags && galleryTags.value ? galleryTags.value.trim() : ''
            });
        } else {
            if (!imageData) { alert('사진을 선택해 주세요.'); if (galleryPhotoFile) galleryPhotoFile.focus(); return; }
            it = {
                id: 'g_' + Date.now(),
                date: dateVal,
                time: timeVal,
                authorName: authorName,
                authorPlayerId: authorPlayerId,
                authorUserId: authorUserId,
                shortText: shortText,
                content: content,
                imageData: imageData,
                eventDate: galleryEventDate && galleryEventDate.value ? galleryEventDate.value : '',
                albumName: galleryAlbumName && galleryAlbumName.value ? galleryAlbumName.value.trim() : '',
                tags: galleryTags && galleryTags.value ? galleryTags.value.trim() : '',
                createdAt: Date.now()
            };
        }

        await dbUpsertGalleryItem(it);
        invalidateDbCache(['gallery']);
        await loadGalleryGrid(true);
        alert(editingGalleryId ? '갤러리가 수정되었습니다.' : '갤러리가 저장되었습니다.');
        closeGalleryAddModal();
    }

    async function handleGalleryDeleteById(id) {
        if (!id) return;
        var it = await findGalleryItemById(id, false);
        if (!it) { alert('삭제할 항목을 찾을 수 없습니다.'); return; }
        var uid = await getCurrentSupabaseUserId();
        if (!canEditOrDeleteGallery(it, uid)) { alert('권한이 없습니다. (등록자 또는 스텝만 가능)'); return; }
        if (!confirm('이 사진을 삭제하시겠습니까?')) return;
        await dbDeleteGalleryItem(id);
        invalidateDbCache(['gallery']);
        await loadGalleryGrid(true);
        alert('삭제되었습니다.');
    }

    function openCommunityAddModal() {
        var a = getAuth();
        if (communityAuthor) communityAuthor.value = a && a.name ? String(a.name) : '';
        if (communityTitle) communityTitle.value = '';
        if (communityContent) communityContent.value = '';
        if (communityDate) communityDate.value = toInputDate(new Date());
        if (communityTime) communityTime.value = nowHHMM();
        editingCommunityId = null;
        if (communityDeleteBtn) communityDeleteBtn.style.display = 'none';
        if (communityModalTitle) communityModalTitle.textContent = '커뮤니티 글쓰기';
        if (communityTitle) communityTitle.focus();
        openModal('communityAddModal');
    }

    async function openCommunityEditModal(id) {
        var post = await findCommunityPostById(id, false);
        if (!post) return;
        var uid = await getCurrentSupabaseUserId();
        if (!canEditOrDeleteCommunity(post, uid)) {
            alert('권한이 없습니다. (작성자 또는 스텝만 가능)');
            return;
        }

        editingCommunityId = post.id;
        if (communityModalTitle) communityModalTitle.textContent = '커뮤니티 글 수정';
        if (communityDeleteBtn) communityDeleteBtn.style.display = '';
        if (communityAuthor) communityAuthor.value = post.authorName || '';
        if (communityTitle) communityTitle.value = post.title || '';
        if (communityContent) communityContent.value = post.content || '';
        if (communityDate) communityDate.value = post.date || '';
        if (communityTime) communityTime.value = post.time || nowHHMM();
        if (communityTitle) communityTitle.focus();
        openModal('communityAddModal');
    }

    async function openCommunityViewModal(id, navIds) {
        var post = await findCommunityPostById(id, false);
        if (!post) return;
        var merged = await mergeCommunityLikes([post]);
        if (merged && merged[0]) post = merged[0];
        viewingCommunityId = post.id;
        if (navIds && Array.isArray(navIds)) setCommunityNavContext(navIds, post.id);
        updateCommunityNavButtons();

        var dt = (post.date || '') + (post.time ? (' ' + post.time) : '');
        var meta = dt;
        if (post.authorName) meta += ' · ' + post.authorName;

        if (communityViewTitle) communityViewTitle.textContent = post.title || '(제목 없음)';
        if (communityViewMeta) communityViewMeta.textContent = meta || '-';
        if (communityViewContent) communityViewContent.textContent = post.content || '';

        var likeCount = (post.likeCount !== undefined ? post.likeCount : 0) || 0;
        var likedByMe = !!post.likedByMe;
        if (communityLikeCount) communityLikeCount.textContent = likeCount;
        if (communityLikeBtn) {
            communityLikeBtn.classList.toggle('community-like-active', likedByMe);
            communityLikeBtn.setAttribute('aria-pressed', likedByMe ? 'true' : 'false');
            setDisabled(communityLikeBtn, !isLoggedIn(), isLoggedIn() ? '좋아요' : '로그인 후 가능');
        }

        var uid = await getCurrentSupabaseUserId();
        var allow = canEditOrDeleteCommunity(post, uid);
        setDisabled(communityViewEditBtn, !allow, allow ? '수정' : '작성자 또는 스텝만 가능');
        setDisabled(communityViewDeleteBtn, !allow, allow ? '삭제' : '작성자 또는 스텝만 가능');

        if (communityCommentForm) {
            setDisabled(communityCommentSubmitBtn, !isLoggedIn(), isLoggedIn() ? '댓글 등록' : '로그인 후 가능');
        }
        await loadCommunityComments(post.id);
        openModal('communityViewModal');
    }

    async function loadCommunityList(force) {
        if (!communityList) return;
        var raw = await fetchCommunityPosts(!!force);
        var list = (raw || []).slice();
        list.sort(function (a, b) {
            var ak = String(a.date || '') + ' ' + String(a.time || '');
            var bk = String(b.date || '') + ' ' + String(b.time || '');
            return bk.localeCompare(ak);
        });
        list = await mergeCommunityLikes(list);
        var show = list.slice(0, 5);
        if (show.length === 0) {
            communityList.innerHTML = '<div class="community-empty">아직 등록된 글이 없습니다.</div>';
            return;
        }
        var showIds = show.map(function (p) { return p && p.id ? String(p.id) : ''; }).filter(Boolean);
        var cMap = await getCommunityCommentCountMap(showIds);
        communityList.innerHTML = show.map(function (p) {
            var dt = (p.date || '') + (p.time ? (' ' + p.time) : '');
            var who = p.authorName ? (' · ' + escapeHtml(p.authorName)) : '';
            var cc = cMap && p.id ? (cMap[String(p.id)] || 0) : 0;
            var badge = cc > 0 ? ('<span class="community-comment-badge">' + cc + '</span>') : '';
            var lc = (p.likeCount !== undefined ? p.likeCount : 0) || 0;
            var heartClass = (p.likedByMe ? ' community-like-active' : '');
            var likeWrap = '<span class="community-like-wrap' + heartClass + '" data-community-id="' + escapeHtml(String(p.id || '')) + '" data-action="like" title="좋아요">♥ <span class="community-like-num">' + lc + '</span></span>';
            return '<div class="community-item" data-community-id="' + escapeHtml(String(p.id || '')) + '">' +
                '<span class="community-date">' + escapeHtml(dt) + who + '</span>' +
                '<span class="community-title-wrap"><span class="community-title">' + escapeHtml(p.title || '(제목 없음)') + '</span>' + badge + likeWrap + '</span>' +
                '</div>';
        }).join('');

        var navIds = show.map(function (p) { return p && p.id ? String(p.id) : ''; }).filter(Boolean);
        communityList.querySelectorAll('.community-item').forEach(function (el) {
            el.addEventListener('click', withAuth(function (e) {
                if (e && e.target && e.target.closest && e.target.closest('[data-action="like"]')) return;
                if (e && e.preventDefault) e.preventDefault();
                var id = el.getAttribute('data-community-id');
                if (!id) return;
                return openCommunityViewModal(id, navIds);
            }));
        });
        communityList.querySelectorAll('.community-like-wrap').forEach(function (el) {
            el.addEventListener('click', withAuth(function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                if (e && e.preventDefault) e.preventDefault();
                var postId = el.getAttribute('data-community-id');
                if (!postId) return;
                toggleCommunityLike(postId).then(function (res) {
                    if (!res) return;
                    var numEl = el.querySelector('.community-like-num');
                    if (numEl) numEl.textContent = res.likeCount;
                    el.classList.toggle('community-like-active', res.likedByMe);
                }).catch(function (err) { console.error(err); });
            }));
        });
    }

    async function runCommunitySearch(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (!communityFullList) return;

        var raw = await fetchCommunityPosts(false);
        var list = (raw || []).slice();
        list.sort(function (a, b) {
            var ak = String(a.date || '') + ' ' + String(a.time || '');
            var bk = String(b.date || '') + ' ' + String(b.time || '');
            return bk.localeCompare(ak);
        });

        var startStr = communityStartDate ? communityStartDate.value : '';
        var endStr = communityEndDate ? communityEndDate.value : '';
        if (startStr || endStr) {
            var startDt = startStr ? new Date(startStr) : null;
            var endDt = endStr ? new Date(endStr) : null;
            if (startDt) startDt.setHours(0, 0, 0, 0);
            if (endDt) endDt.setHours(23, 59, 59, 999);
            list = list.filter(function (p) {
                var d = p && p.date ? new Date(p.date) : null;
                if (!d || isNaN(d.getTime())) return false;
                var t = d.getTime();
                if (startDt && t < startDt.getTime()) return false;
                if (endDt && t > endDt.getTime()) return false;
                return true;
            });
        }

        list = await mergeCommunityLikes(list);
        if (list.length === 0) {
            communityFullList.innerHTML = '<div class="notice-empty">조건에 맞는 글이 없습니다.</div>';
            return;
        }

        var ids = list.map(function (p) { return p && p.id ? String(p.id) : ''; }).filter(Boolean);
        var cMap = await getCommunityCommentCountMap(ids);
        communityFullList.innerHTML = list.map(function (p) {
            var dt = (p.date || '') + (p.time ? (' ' + p.time) : '');
            var who = p.authorName ? (' · ' + escapeHtml(p.authorName)) : '';
            var cc = cMap && p.id ? (cMap[String(p.id)] || 0) : 0;
            var badge = cc > 0 ? ('<span class="community-comment-badge">' + cc + '</span>') : '';
            var lc = (p.likeCount !== undefined ? p.likeCount : 0) || 0;
            var heartClass = (p.likedByMe ? ' community-like-active' : '');
            var likeWrap = '<span class="community-like-wrap' + heartClass + '" data-community-id="' + escapeHtml(String(p.id || '')) + '" data-action="like" title="좋아요">♥ <span class="community-like-num">' + lc + '</span></span>';
            return '<div class="notice-full-item" data-community-id="' + escapeHtml(String(p.id || '')) + '">' +
                '<span class="notice-full-date">' + escapeHtml(dt) + who + '</span>' +
                '<span class="notice-full-title">' + escapeHtml(p.title || '(제목 없음)') + '</span>' +
                badge + likeWrap +
                '</div>';
        }).join('');

        var navIds = list.map(function (p) { return p && p.id ? String(p.id) : ''; }).filter(Boolean);
        communityFullList.querySelectorAll('.notice-full-item').forEach(function (el) {
            el.addEventListener('click', withAuth(function (e) {
                if (e && e.target && e.target.closest && e.target.closest('[data-action="like"]')) return;
                if (e && e.preventDefault) e.preventDefault();
                var id = el.getAttribute('data-community-id');
                if (!id) return;
                return openCommunityViewModal(id, navIds);
            }));
            el.addEventListener('dblclick', withAuth(function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                var id = el.getAttribute('data-community-id');
                if (!id) return;
                closeCommunityListModal();
                return openCommunityEditModal(id);
            }));
        });
        communityFullList.querySelectorAll('.community-like-wrap').forEach(function (el) {
            el.addEventListener('click', withAuth(function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                if (e && e.preventDefault) e.preventDefault();
                var postId = el.getAttribute('data-community-id');
                if (!postId) return;
                toggleCommunityLike(postId).then(function (res) {
                    if (!res) return;
                    var numEl = el.querySelector('.community-like-num');
                    if (numEl) numEl.textContent = res.likeCount;
                    el.classList.toggle('community-like-active', res.likedByMe);
                }).catch(function (err) { console.error(err); });
            }));
        });
    }

    async function openCommunityListModal() {
        if (communityStartDate && communityEndDate) {
            var end = new Date();
            var start = new Date(end);
            start.setMonth(start.getMonth() - 1);
            communityStartDate.value = toInputDate(start);
            communityEndDate.value = toInputDate(end);
        }
        await runCommunitySearch();
        openModal('communityListModal');
    }

    async function handleCommunityAddSubmit(e) {
        e.preventDefault();

        var title = (communityTitle && communityTitle.value ? communityTitle.value : '').trim();
        var dateVal = communityDate && communityDate.value ? communityDate.value : '';
        var timeVal = communityTime && communityTime.value ? communityTime.value : '';
        var content = (communityContent && communityContent.value ? communityContent.value : '').trim();

        if (!title) {
            alert('제목을 입력해 주세요.');
            if (communityTitle) communityTitle.focus();
            return;
        }
        if (!dateVal) {
            alert('작성일을 선택해 주세요.');
            if (communityDate) communityDate.focus();
            return;
        }
        if (!timeVal) {
            alert('작성 시간을 입력해 주세요.');
            if (communityTime) communityTime.focus();
            return;
        }
        if (byteLen(content) > 1000) {
            alert('내용은 1000BYTE 이내로 입력해 주세요.');
            if (communityContent) communityContent.focus();
            return;
        }

        var a = getAuth();
        var authorName = a && a.name ? String(a.name) : '';
        var authorPlayerId = a && a.playerId ? String(a.playerId) : null;
        var authorUserId = null;

        if (isSupabaseReady()) {
            try {
                initSupabase();
                var sess = await sb.auth.getSession();
                authorUserId = sess && sess.data && sess.data.session && sess.data.session.user ? sess.data.session.user.id : null;
            } catch (err) {
                console.error(err);
            }
        }

        var post = null;
        if (editingCommunityId) {
            var existing = await findCommunityPostById(editingCommunityId, false);
            if (!existing) {
                alert('수정 대상 글을 찾을 수 없습니다.');
                return;
            }
            var uid = await getCurrentSupabaseUserId();
            if (!canEditOrDeleteCommunity(existing, uid)) {
                alert('권한이 없습니다. (작성자 또는 스텝만 가능)');
                return;
            }
            post = Object.assign({}, existing, {
                date: dateVal,
                time: timeVal,
                title: title,
                content: content
            });
        } else {
            post = {
                id: 'c_' + Date.now(),
                date: dateVal,
                time: timeVal,
                authorName: authorName,
                authorPlayerId: authorPlayerId,
                authorUserId: authorUserId,
                title: title,
                content: content,
                createdAt: Date.now()
            };
        }

        await dbUpsertCommunityPost(post);
        invalidateDbCache(['community']);
        await loadCommunityList(true);
        alert(editingCommunityId ? '커뮤니티 글이 수정되었습니다.' : '커뮤니티 글이 저장되었습니다.');
        closeCommunityAddModal();
    }

    async function handleCommunityDeleteById(id) {
        if (!id) return;
        var post = await findCommunityPostById(id, false);
        if (!post) {
            alert('삭제할 글을 찾을 수 없습니다.');
            return;
        }
        var uid = await getCurrentSupabaseUserId();
        if (!canEditOrDeleteCommunity(post, uid)) {
            alert('권한이 없습니다. (작성자 또는 스텝만 가능)');
            return;
        }
        if (!confirm('이 글을 삭제하시겠습니까?')) return;
        await dbDeleteCommunityPost(id);
        invalidateDbCache(['community']);
        await loadCommunityList(true);
        alert('삭제되었습니다.');
    }

    function openNoticeAddModal() {
        editingNoticeId = null;
        if (noticeDeleteBtn) noticeDeleteBtn.style.display = 'none';
        var today = new Date();
        noticeDate.value = toInputDate(today);
        noticeTitle.value = '';
        noticeContent.value = '';
        noticeTitle.focus();
        openModal('noticeAddModal');
    }

    function closeNoticeAddModal() {
        editingNoticeId = null;
        if (noticeDeleteBtn) noticeDeleteBtn.style.display = 'none';
        closeModal('noticeAddModal');
    }

    async function openNoticeEditModal(noticeId) {
        if (!noticeId) return;
        var notices = await fetchNotices(false);
        var n = (notices || []).filter(function (x) { return x && x.id === noticeId; })[0] || null;
        if (!n) return;
        editingNoticeId = noticeId;
        if (noticeDeleteBtn) noticeDeleteBtn.style.display = '';
        noticeTitle.value = n.title || '';
        noticeContent.value = n.content || '';
        var d = parseNoticeDate(n.date);
        noticeDate.value = d ? toInputDate(d) : '';
        noticeTitle.focus();
        openModal('noticeAddModal');
    }

    async function openNoticeListModal() {
        var end = new Date();
        var start = new Date(end);
        start.setMonth(start.getMonth() - 1);
        noticeStartDate.value = toInputDate(start);
        noticeEndDate.value = toInputDate(end);
        await runNoticeSearch(false);
        openModal('noticeListModal');
    }

    function closeNoticeListModal() {
        selectedNoticeId = null;
        applyPermissionUi();
        closeModal('noticeListModal');
    }

    async function runNoticeSearch(force) {
        selectedNoticeId = null;
        if (noticeListDeleteBtn) noticeListDeleteBtn.setAttribute('disabled', 'disabled');
        var raw = await fetchNotices(!!force);
        var startStr = noticeStartDate.value;
        var endStr = noticeEndDate.value;

        var list = raw.slice();
        list.sort(function (a, b) {
            var da = parseNoticeDate(a.date);
            var db = parseNoticeDate(b.date);
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return db.getTime() - da.getTime();
        });

        if (startStr || endStr) {
            var startDt = startStr ? new Date(startStr) : null;
            var endDt = endStr ? new Date(endStr) : null;
            if (startDt) startDt.setHours(0, 0, 0, 0);
            if (endDt) endDt.setHours(23, 59, 59, 999);

            list = list.filter(function (n) {
                var d = parseNoticeDate(n.date);
                if (!d) return false;
                var t = d.getTime();
                if (startDt && t < startDt.getTime()) return false;
                if (endDt && t > endDt.getTime()) return false;
                return true;
            });
        }

        if (!noticeFullList) return;
        if (list.length === 0) {
            noticeFullList.innerHTML = '<div class="notice-empty">조건에 맞는 공지가 없습니다.</div>';
            return;
        }

        noticeFullList.innerHTML = list.map(function (n) {
            return '<div class="notice-full-item" data-notice-id="' + escapeHtml(String(n.id || '')) + '">' +
                '<span class="notice-full-date">' + (n.date || '') + '</span>' +
                '<span class="notice-full-title">' + (n.title ? escapeHtml(n.title) : '(제목 없음)') + '</span>' +
                '</div>';
        }).join('');

        noticeFullList.querySelectorAll('.notice-full-item').forEach(function (el) {
            el.addEventListener('click', withAuth(function (e) {
                if (e && e.preventDefault) e.preventDefault();
                var id = el.getAttribute('data-notice-id');
                if (!id) return;
                selectedNoticeId = id;
                noticeFullList.querySelectorAll('.notice-full-item').forEach(function (x) {
                    if (x === el) x.classList.add('is-selected');
                    else x.classList.remove('is-selected');
                });
                applyPermissionUi();
            }));
            el.addEventListener('dblclick', withManage(function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                var id = el.getAttribute('data-notice-id');
                if (!id) return;
                closeNoticeListModal();
                return openNoticeEditModal(id);
            }));
        });
    }

    function escapeHtml(s) {
        if (!s) return '';
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    var MAIN_NOTICE_LIMIT = 5;

    async function loadNoticeList(force) {
        var raw = await fetchNotices(!!force);
        var list = raw.slice();
        list.sort(function (a, b) {
            var da = parseNoticeDate(a.date);
            var db = parseNoticeDate(b.date);
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return db.getTime() - da.getTime();
        });
        var show = list.slice(0, MAIN_NOTICE_LIMIT);

        if (show.length === 0) {
            if (noticeList) noticeList.innerHTML = '<div class="notice-empty">등록된 공지가 없습니다.</div>';
            return;
        }

        noticeList.innerHTML = show.map(function (n) {
            return '<div class="notice-item">' +
                '<span class="notice-date">' + (n.date || '') + '</span>' +
                '<span class="notice-text">' + escapeHtml(n.title || '(제목 없음)') + '</span>' +
                '</div>';
        }).join('');
    }

    async function handleNoticeAddSubmit(e) {
        e.preventDefault();
        var title = (noticeTitle.value || '').trim();
        var dateVal = noticeDate.value;
        var content = (noticeContent.value || '').trim();

        if (!title) {
            alert('제목을 입력해 주세요.');
            noticeTitle.focus();
            return;
        }
        if (!dateVal) {
            alert('등록일을 선택해 주세요.');
            noticeDate.focus();
            return;
        }

        var d = new Date(dateVal);
        var dateFormatted = formatNoticeDate(d);

        var existingCreatedAt = null;
        if (editingNoticeId) {
            var list = await fetchNotices(false);
            var existing = (list || []).filter(function (x) { return x && x.id === editingNoticeId; })[0] || null;
            existingCreatedAt = existing && existing.createdAt ? existing.createdAt : null;
        }
        var newNotice = {
            id: editingNoticeId || ('n_' + Date.now()),
            title: title,
            date: dateFormatted,
            content: content,
            createdAt: existingCreatedAt || Date.now()
        };
        if (isDbMode()) {
            await dbUpsertNotice(newNotice);
            invalidateDbCache(['notices']);
        } else {
            var notices = getNotices();
            if (editingNoticeId) {
                var idx = notices.findIndex(function (x) { return x && x.id === editingNoticeId; });
                if (idx !== -1) notices[idx] = newNotice;
                else notices.unshift(newNotice);
            } else {
                notices.unshift(newNotice);
            }
            saveNotices(notices);
        }

        await loadNoticeList(true);
        editingNoticeId = null;
        if (noticeDeleteBtn) noticeDeleteBtn.style.display = 'none';
        closeNoticeAddModal();
    }

    async function handleNoticeDeleteSelected() {
        if (!selectedNoticeId) return;
        if (!confirm('선택한 공지를 삭제하시겠습니까?')) return;
        await dbDeleteNotice(selectedNoticeId);
        selectedNoticeId = null;
        invalidateDbCache(['notices']);
        await loadNoticeList(true);
        await runNoticeSearch(true);
        applyPermissionUi();
        alert('삭제되었습니다.');
    }

    async function handleNoticeDeleteFromModal() {
        if (!editingNoticeId) return;
        if (!confirm('이 공지를 삭제하시겠습니까?')) return;
        await dbDeleteNotice(editingNoticeId);
        editingNoticeId = null;
        if (noticeDeleteBtn) noticeDeleteBtn.style.display = 'none';
        invalidateDbCache(['notices']);
        closeNoticeAddModal();
        await loadNoticeList(true);
        // 목록 모달이 열려있다면 최신 반영
        await runNoticeSearch(true);
        applyPermissionUi();
        alert('삭제되었습니다.');
    }

    function openScheduleAddModal() {
        editingScheduleId = null;
        if (scheduleModalTitle) scheduleModalTitle.textContent = '경기 일정 등록';
        if (scheduleDeleteBtn) scheduleDeleteBtn.style.display = 'none';
        if (scheduleLeague) scheduleLeague.value = getSelectedLeague() || 'nono';
        var today = new Date();
        scheduleDate.value = toInputDate(today);
        scheduleTime.value = '13:00';
        scheduleOpponent.value = '';
        scheduleLocation.value = '';
        scheduleStatus.value = '예정';
        if (scheduleBatOrder) scheduleBatOrder.value = '선공';
        if (scheduleResult) scheduleResult.value = '';
        if (scheduleOurScore) scheduleOurScore.value = '';
        if (scheduleOpponentScore) scheduleOpponentScore.value = '';
        switchScheduleResultRow();
        scheduleOpponent.focus();
        openModal('scheduleAddModal');
    }

    function switchScheduleResultRow() {
        var status = scheduleStatus ? scheduleStatus.value : '';
        var show = status === '완료';
        if (scheduleResultRow) scheduleResultRow.style.display = show ? '' : 'none';
        if (scheduleScoreRow) scheduleScoreRow.style.display = show ? '' : 'none';
    }

    async function openScheduleEditModal(scheduleId) {
        var schedules = await fetchSchedules(false);
        var s = schedules.filter(function (x) { return x.id === scheduleId; })[0];
        if (!s) return;
        editingScheduleId = scheduleId;
        if (scheduleModalTitle) scheduleModalTitle.textContent = '경기 일정 수정';
        if (scheduleDeleteBtn) scheduleDeleteBtn.style.display = '';
        if (scheduleLeague) scheduleLeague.value = s.leagueId ? String(s.leagueId) : (getSelectedLeague() || 'nono');
        scheduleDate.value = s.date || '';
        scheduleTime.value = s.time || '13:00';
        scheduleOpponent.value = s.opponent || '';
        scheduleLocation.value = s.location || '';
        scheduleStatus.value = s.status || '예정';
        if (scheduleBatOrder) scheduleBatOrder.value = s.batOrder || '선공';
        if (scheduleResult) scheduleResult.value = s.result || '';
        if (scheduleOurScore) scheduleOurScore.value = s.ourScore !== undefined && s.ourScore !== '' ? String(s.ourScore) : '';
        if (scheduleOpponentScore) scheduleOpponentScore.value = s.opponentScore !== undefined && s.opponentScore !== '' ? String(s.opponentScore) : '';
        switchScheduleResultRow();
        scheduleOpponent.focus();
        openModal('scheduleAddModal');
    }

    function playerSelectOptions(players, selectedId) {
        var opts = (players || []).map(function (p) {
            var sel = (p.id === selectedId) ? ' selected' : '';
            return '<option value="' + escapeHtml(p.id || '') + '"' + sel + '>' + escapeHtml(String(p.jerseyNo || '') + ' ' + (p.name || '')) + '</option>';
        });
        return '<option value="">선수 선택</option>' + opts.join('');
    }

    function gameBattingAvg(ab, h) {
        var a = parseInt(ab, 10) || 0;
        var b = parseInt(h, 10) || 0;
        return a > 0 ? (b / a).toFixed(3) : '0.000';
    }

    function makeGameBattingRow(players, line) {
        line = line || {};
        var pid = line.playerId || '';
        var rowId = line.id || 'gbl_row_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        var p = players.filter(function (x) { return x.id === pid; })[0];
        var pos = p ? (p.primaryPos || '') : '';
        var orderVal = line.battingOrder != null && line.battingOrder !== '' ? line.battingOrder : '';
        var avg = gameBattingAvg(line.ab, line.h);
        var seasonVal = line.season_avg != null && line.season_avg !== '' ? String(line.season_avg) : '';
        var i1 = escapeHtml((line.inning_1 || '').trim());
        var i2 = escapeHtml((line.inning_2 || '').trim());
        var i3 = escapeHtml((line.inning_3 || '').trim());
        var i4 = escapeHtml((line.inning_4 || '').trim());
        var i5 = escapeHtml((line.inning_5 || '').trim());
        var i6 = escapeHtml((line.inning_6 || '').trim());
        var i7 = escapeHtml((line.inning_7 || '').trim());
        var i8 = escapeHtml((line.inning_8 || '').trim());
        var i9 = escapeHtml((line.inning_9 || '').trim());
        var orderValStr = (orderVal !== '' && orderVal != null) ? escapeHtml(String(orderVal)) : '';
        return '<tr class="game-line-row" data-row-id="' + escapeHtml(rowId) + '">' +
            '<td class="td-player">' +
            '<input type="hidden" class="game-line-order" value="' + orderValStr + '" />' +
            '<select class="game-line-player-select" title="선수">' + playerSelectOptions(players, pid) + '</select></td>' +
            '<td><input type="text" class="game-line-inning-1" value="' + i1 + '" title="1회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-2" value="' + i2 + '" title="2회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-3" value="' + i3 + '" title="3회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-4" value="' + i4 + '" title="4회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-5" value="' + i5 + '" title="5회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-6" value="' + i6 + '" title="6회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-7" value="' + i7 + '" title="7회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-8" value="' + i8 + '" title="8회 타석 결과" /></td>' +
            '<td><input type="text" class="game-line-inning-9" value="' + i9 + '" title="9회 타석 결과" /></td>' +
            '<td><input type="number" class="game-line-ab" min="0" value="' + (line.ab != null ? line.ab : 0) + '" title="타수" /></td>' +
            '<td><input type="number" class="game-line-h" min="0" value="' + (line.h != null ? line.h : 0) + '" title="안타" /></td>' +
            '<td><input type="number" class="game-line-rbi" min="0" value="' + (line.rbi != null ? line.rbi : 0) + '" title="타점" /></td>' +
            '<td><input type="number" class="game-line-r" min="0" value="' + (line.r != null ? line.r : 0) + '" title="득점" /></td>' +
            '<td><input type="number" class="game-line-sb" min="0" value="' + (line.sb != null ? line.sb : 0) + '" title="도루" /></td>' +
            '<td><span class="game-line-avg game-line-readonly" data-ab="' + (line.ab != null ? line.ab : 0) + '" data-h="' + (line.h != null ? line.h : 0) + '" title="자동 계산 (안타÷타수)">' + avg + '</span></td>' +
            '<td><input type="text" class="game-line-season-avg" value="' + escapeHtml(seasonVal) + '" placeholder="시즌 타율" title="시즌 타율 (선택)" /></td>' +
            '<td><button type="button" class="btn btn-small btn-remove-line" title="행 삭제">삭제</button></td></tr>';
    }

    function gamePitchingEra(ip, er) {
        var i = parseFloat(String(ip || '0')) || 0;
        var e = parseInt(er, 10) || 0;
        return i > 0 ? ((e * 9) / i).toFixed(2) : (e > 0 ? '—' : '0.00');
    }

    function makeGamePitchingRow(players, line) {
        line = line || {};
        var pid = line.playerId || '';
        var rowId = line.id || 'gpl_row_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        var era = gamePitchingEra(line.ip, line.er);
        var seasonEraVal = line.season_era != null && line.season_era !== '' ? String(line.season_era) : '';
        return '<tr class="game-line-row" data-row-id="' + escapeHtml(rowId) + '">' +
            '<td class="td-player"><select class="game-line-player-select" title="선수">' + playerSelectOptions(players, pid) + '</select></td>' +
            '<td class="td-result"><input type="text" class="game-line-result" value="' + escapeHtml((line.result || '').trim()) + '" placeholder="승/패" title="결과(예: 승)" /></td>' +
            '<td class="td-w"><input type="number" class="game-line-w" min="0" value="' + (line.w != null ? line.w : 0) + '" title="승" /></td>' +
            '<td class="td-l"><input type="number" class="game-line-l" min="0" value="' + (line.l != null ? line.l : 0) + '" title="패" /></td>' +
            '<td class="td-sv"><input type="number" class="game-line-sv" min="0" value="' + (line.sv != null ? line.sv : 0) + '" title="세이브" /></td>' +
            '<td><input type="number" class="game-line-ip" min="0" step="0.1" value="' + (line.ip != null && line.ip !== '' ? line.ip : 0) + '" placeholder="5.1" title="이닝" /></td>' +
            '<td><input type="number" class="game-line-bf" min="0" value="' + (line.bf != null ? line.bf : 0) + '" title="타자" /></td>' +
            '<td><input type="number" class="game-line-ab" min="0" value="' + (line.ab != null ? line.ab : 0) + '" title="타수" /></td>' +
            '<td><input type="number" class="game-line-h" min="0" value="' + (line.h != null ? line.h : 0) + '" title="피안타" /></td>' +
            '<td><input type="number" class="game-line-hr" min="0" value="' + (line.hr != null ? line.hr : 0) + '" title="피홈런" /></td>' +
            '<td><input type="number" class="game-line-sh" min="0" value="' + (line.sh != null ? line.sh : 0) + '" title="희타" /></td>' +
            '<td><input type="number" class="game-line-sf" min="0" value="' + (line.sf != null ? line.sf : 0) + '" title="희비" /></td>' +
            '<td><input type="number" class="game-line-bb" min="0" value="' + (line.bb != null ? line.bb : 0) + '" title="볼넷" /></td>' +
            '<td><input type="number" class="game-line-hbp" min="0" value="' + (line.hbp != null ? line.hbp : 0) + '" title="사구" /></td>' +
            '<td><input type="number" class="game-line-so" min="0" value="' + (line.so != null ? line.so : 0) + '" title="삼진" /></td>' +
            '<td><input type="number" class="game-line-wp" min="0" value="' + (line.wp != null ? line.wp : 0) + '" title="폭투" /></td>' +
            '<td><input type="number" class="game-line-balk" min="0" value="' + (line.balk != null ? line.balk : 0) + '" title="보크" /></td>' +
            '<td><input type="number" class="game-line-r" min="0" value="' + (line.r != null ? line.r : 0) + '" title="실점" /></td>' +
            '<td><input type="number" class="game-line-er" min="0" value="' + (line.er != null ? line.er : 0) + '" title="자책점" /></td>' +
            '<td><input type="number" class="game-line-np" min="0" value="' + (line.np != null ? line.np : 0) + '" title="투구수" /></td>' +
            '<td class="td-era"><span class="game-line-era game-line-readonly" data-ip="' + (line.ip != null ? line.ip : 0) + '" data-er="' + (line.er != null ? line.er : 0) + '" title="자동 계산 (자책점×9÷이닝)">' + era + '</span></td>' +
            '<td class="td-season"><input type="text" class="game-line-season-era" value="' + escapeHtml(seasonEraVal) + '" placeholder="시즌" title="시즌 방어율 (선택)" /></td>' +
            '<td><button type="button" class="btn btn-small btn-remove-line" title="행 삭제">삭제</button></td></tr>';
    }

    function makeGameOpponentBattingRow(line) {
        line = line || {};
        var rowId = line.id || 'gobl_row_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        var nameVal = escapeHtml((line.playerName || '').trim());
        var orderVal = line.battingOrder != null && line.battingOrder !== '' ? line.battingOrder : '';
        var avg = gameBattingAvg(line.ab, line.h);
        var seasonVal = line.season_avg != null && line.season_avg !== '' ? String(line.season_avg) : '';
        var i1 = escapeHtml((line.inning_1 || '').trim());
        var i2 = escapeHtml((line.inning_2 || '').trim());
        var i3 = escapeHtml((line.inning_3 || '').trim());
        var i4 = escapeHtml((line.inning_4 || '').trim());
        var i5 = escapeHtml((line.inning_5 || '').trim());
        var i6 = escapeHtml((line.inning_6 || '').trim());
        var i7 = escapeHtml((line.inning_7 || '').trim());
        var i8 = escapeHtml((line.inning_8 || '').trim());
        var i9 = escapeHtml((line.inning_9 || '').trim());
        var orderValStr = (orderVal !== '' && orderVal != null) ? escapeHtml(String(orderVal)) : '';
        return '<tr class="game-line-row game-opponent-row" data-row-id="' + escapeHtml(rowId) + '">' +
            '<td class="td-player"><input type="text" class="game-opponent-player-name" value="' + nameVal + '" placeholder="상대팀 선수명" title="상대팀 선수명" /></td>' +
            '<td><input type="text" class="game-line-inning-1" value="' + i1 + '" title="1회" /></td>' +
            '<td><input type="text" class="game-line-inning-2" value="' + i2 + '" title="2회" /></td>' +
            '<td><input type="text" class="game-line-inning-3" value="' + i3 + '" title="3회" /></td>' +
            '<td><input type="text" class="game-line-inning-4" value="' + i4 + '" title="4회" /></td>' +
            '<td><input type="text" class="game-line-inning-5" value="' + i5 + '" title="5회" /></td>' +
            '<td><input type="text" class="game-line-inning-6" value="' + i6 + '" title="6회" /></td>' +
            '<td><input type="text" class="game-line-inning-7" value="' + i7 + '" title="7회" /></td>' +
            '<td><input type="text" class="game-line-inning-8" value="' + i8 + '" title="8회" /></td>' +
            '<td><input type="text" class="game-line-inning-9" value="' + i9 + '" title="9회" /></td>' +
            '<td><input type="number" class="game-line-ab" min="0" value="' + (line.ab != null ? line.ab : 0) + '" title="타수" /></td>' +
            '<td><input type="number" class="game-line-h" min="0" value="' + (line.h != null ? line.h : 0) + '" title="안타" /></td>' +
            '<td><input type="number" class="game-line-rbi" min="0" value="' + (line.rbi != null ? line.rbi : 0) + '" title="타점" /></td>' +
            '<td><input type="number" class="game-line-r" min="0" value="' + (line.r != null ? line.r : 0) + '" title="득점" /></td>' +
            '<td><input type="number" class="game-line-sb" min="0" value="' + (line.sb != null ? line.sb : 0) + '" title="도루" /></td>' +
            '<td><span class="game-line-avg game-line-readonly" data-ab="' + (line.ab != null ? line.ab : 0) + '" data-h="' + (line.h != null ? line.h : 0) + '">' + avg + '</span></td>' +
            '<td><input type="text" class="game-line-season-avg" value="' + escapeHtml(seasonVal) + '" placeholder="시즌" title="시즌 타율 (선택)" /></td>' +
            '<td><button type="button" class="btn btn-small btn-remove-line" title="행 삭제">삭제</button></td></tr>';
    }

    function makeGameOpponentPitchingRow(line) {
        line = line || {};
        var rowId = line.id || 'gopl_row_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        var nameVal = escapeHtml((line.playerName || '').trim());
        var era = gamePitchingEra(line.ip, line.er);
        var seasonEraVal = line.season_era != null && line.season_era !== '' ? String(line.season_era) : '';
        return '<tr class="game-line-row game-opponent-row" data-row-id="' + escapeHtml(rowId) + '">' +
            '<td class="td-player"><input type="text" class="game-opponent-player-name" value="' + nameVal + '" placeholder="상대팀 선수명" title="상대팀 투수명" /></td>' +
            '<td class="td-result"><input type="text" class="game-line-result" value="' + escapeHtml((line.result || '').trim()) + '" placeholder="승/패" /></td>' +
            '<td class="td-w"><input type="number" class="game-line-w" min="0" value="' + (line.w != null ? line.w : 0) + '" title="승" /></td>' +
            '<td class="td-l"><input type="number" class="game-line-l" min="0" value="' + (line.l != null ? line.l : 0) + '" title="패" /></td>' +
            '<td class="td-sv"><input type="number" class="game-line-sv" min="0" value="' + (line.sv != null ? line.sv : 0) + '" title="세이브" /></td>' +
            '<td><input type="number" class="game-line-ip" min="0" step="0.1" value="' + (line.ip != null && line.ip !== '' ? line.ip : 0) + '" placeholder="5.1" title="이닝" /></td>' +
            '<td><input type="number" class="game-line-bf" min="0" value="' + (line.bf != null ? line.bf : 0) + '" title="타자" /></td>' +
            '<td><input type="number" class="game-line-ab" min="0" value="' + (line.ab != null ? line.ab : 0) + '" title="타수" /></td>' +
            '<td><input type="number" class="game-line-h" min="0" value="' + (line.h != null ? line.h : 0) + '" title="피안타" /></td>' +
            '<td><input type="number" class="game-line-hr" min="0" value="' + (line.hr != null ? line.hr : 0) + '" title="피홈런" /></td>' +
            '<td><input type="number" class="game-line-sh" min="0" value="' + (line.sh != null ? line.sh : 0) + '" title="희타" /></td>' +
            '<td><input type="number" class="game-line-sf" min="0" value="' + (line.sf != null ? line.sf : 0) + '" title="희비" /></td>' +
            '<td><input type="number" class="game-line-bb" min="0" value="' + (line.bb != null ? line.bb : 0) + '" title="볼넷" /></td>' +
            '<td><input type="number" class="game-line-hbp" min="0" value="' + (line.hbp != null ? line.hbp : 0) + '" title="사구" /></td>' +
            '<td><input type="number" class="game-line-so" min="0" value="' + (line.so != null ? line.so : 0) + '" title="삼진" /></td>' +
            '<td><input type="number" class="game-line-wp" min="0" value="' + (line.wp != null ? line.wp : 0) + '" title="폭투" /></td>' +
            '<td><input type="number" class="game-line-balk" min="0" value="' + (line.balk != null ? line.balk : 0) + '" title="보크" /></td>' +
            '<td><input type="number" class="game-line-r" min="0" value="' + (line.r != null ? line.r : 0) + '" title="실점" /></td>' +
            '<td><input type="number" class="game-line-er" min="0" value="' + (line.er != null ? line.er : 0) + '" title="자책점" /></td>' +
            '<td><input type="number" class="game-line-np" min="0" value="' + (line.np != null ? line.np : 0) + '" title="투구수" /></td>' +
            '<td class="td-era"><span class="game-line-era game-line-readonly" data-ip="' + (line.ip != null ? line.ip : 0) + '" data-er="' + (line.er != null ? line.er : 0) + '">' + era + '</span></td>' +
            '<td class="td-season"><input type="text" class="game-line-season-era" value="' + escapeHtml(seasonEraVal) + '" placeholder="시즌" title="시즌 방어율 (선택)" /></td>' +
            '<td><button type="button" class="btn btn-small btn-remove-line" title="행 삭제">삭제</button></td></tr>';
    }

    async function openGameScorecardModal(scheduleId) {
        if (!scheduleId) return;
        currentScorecardScheduleId = scheduleId;
        if (gameScorecardModalTitle) gameScorecardModalTitle.textContent = '경기 기록지';
        if (gameScorecardInfo) gameScorecardInfo.textContent = '로딩 중...';
        if (gameBattingLinesBody) gameBattingLinesBody.innerHTML = '';
        if (gamePitchingLinesBody) gamePitchingLinesBody.innerHTML = '';
        if (gameOpponentBattingLinesBody) gameOpponentBattingLinesBody.innerHTML = '';
        if (gameOpponentPitchingLinesBody) gameOpponentPitchingLinesBody.innerHTML = '';
        if (gameScorecardSaveBtn) gameScorecardSaveBtn.disabled = true;
        openModal('gameScorecardModal');

        var schedules = [];
        try {
            schedules = await fetchSchedules(false);
        } catch (e) {
            console.error(e);
        }
        var s = schedules.filter(function (x) { return x.id === scheduleId; })[0];
        if (!s) {
            if (gameScorecardInfo) {
                gameScorecardInfo.textContent = '경기 정보를 불러올 수 없습니다. Supabase 사용 시 우측 상단에서 이메일/비밀번호로 로그인해 주세요.';
                gameScorecardInfo.style.color = 'var(--accent)';
            }
            return;
        }
        var dt = formatScheduleDateTime(s.date, s.time);
        var title = (dt || '') + ' vs ' + (s.opponent || '');
        if (gameScorecardInfo) {
            gameScorecardInfo.textContent = title;
            gameScorecardInfo.style.color = '';
        }
        var players = [];
        try {
            players = (await fetchPlayers(false)).filter(isPlayerForRecords);
        } catch (e) {
            console.error(e);
        }
        currentScorecardPlayers = players;
        var battingLines = [];
        var pitchingLines = [];
        var opponentBattingLines = [];
        var opponentPitchingLines = [];
        try {
            battingLines = await dbListGameBattingLines(scheduleId);
            pitchingLines = await dbListGamePitchingLines(scheduleId);
            opponentBattingLines = await dbListGameOpponentBattingLines(scheduleId);
            opponentPitchingLines = await dbListGameOpponentPitchingLines(scheduleId);
        } catch (e) {
            console.error(e);
        }
        if (gameBattingLinesBody) {
            gameBattingLinesBody.innerHTML = battingLines.length ? battingLines.map(function (ln) { return makeGameBattingRow(players, ln); }).join('') : '';
            gameBattingLinesBody.querySelectorAll('.btn-remove-line').forEach(function (btn) {
                btn.addEventListener('click', function () { btn.closest('tr').remove(); });
            });
        }
        if (gamePitchingLinesBody) {
            gamePitchingLinesBody.innerHTML = pitchingLines.length ? pitchingLines.map(function (ln) { return makeGamePitchingRow(players, ln); }).join('') : '';
            gamePitchingLinesBody.querySelectorAll('.btn-remove-line').forEach(function (btn) {
                btn.addEventListener('click', function () { btn.closest('tr').remove(); });
            });
        }
        if (gameBattingAddRowBtn) {
            gameBattingAddRowBtn.onclick = function () {
                if (!gameBattingLinesBody) return;
                var wrap = document.createElement('tbody');
                wrap.innerHTML = makeGameBattingRow(players, {});
                var newTr = wrap.querySelector('tr');
                if (newTr) {
                    gameBattingLinesBody.appendChild(newTr);
                    newTr.querySelector('.btn-remove-line').addEventListener('click', function () { newTr.remove(); });
                }
            };
        }
        if (gamePitchingAddRowBtn) {
            gamePitchingAddRowBtn.onclick = function () {
                if (!gamePitchingLinesBody) return;
                var wrap = document.createElement('tbody');
                wrap.innerHTML = makeGamePitchingRow(players, {});
                var newTr = wrap.querySelector('tr');
                if (newTr) {
                    gamePitchingLinesBody.appendChild(newTr);
                    newTr.querySelector('.btn-remove-line').addEventListener('click', function () { newTr.remove(); });
                }
            };
        }
        if (gameOpponentBattingLinesBody) {
            gameOpponentBattingLinesBody.innerHTML = opponentBattingLines.length ? opponentBattingLines.map(function (ln) { return makeGameOpponentBattingRow(ln); }).join('') : '';
            gameOpponentBattingLinesBody.querySelectorAll('.btn-remove-line').forEach(function (btn) {
                btn.addEventListener('click', function () { btn.closest('tr').remove(); });
            });
        }
        if (gameOpponentPitchingLinesBody) {
            gameOpponentPitchingLinesBody.innerHTML = opponentPitchingLines.length ? opponentPitchingLines.map(function (ln) { return makeGameOpponentPitchingRow(ln); }).join('') : '';
            gameOpponentPitchingLinesBody.querySelectorAll('.btn-remove-line').forEach(function (btn) {
                btn.addEventListener('click', function () { btn.closest('tr').remove(); });
            });
        }
        if (gameOpponentBattingAddRowBtn) {
            gameOpponentBattingAddRowBtn.onclick = function () {
                if (!gameOpponentBattingLinesBody) return;
                var wrap = document.createElement('tbody');
                wrap.innerHTML = makeGameOpponentBattingRow({});
                var newTr = wrap.querySelector('tr');
                if (newTr) {
                    gameOpponentBattingLinesBody.appendChild(newTr);
                    newTr.querySelector('.btn-remove-line').addEventListener('click', function () { newTr.remove(); });
                }
            };
        }
        if (gameOpponentPitchingAddRowBtn) {
            gameOpponentPitchingAddRowBtn.onclick = function () {
                if (!gameOpponentPitchingLinesBody) return;
                var wrap = document.createElement('tbody');
                wrap.innerHTML = makeGameOpponentPitchingRow({});
                var newTr = wrap.querySelector('tr');
                if (newTr) {
                    gameOpponentPitchingLinesBody.appendChild(newTr);
                    newTr.querySelector('.btn-remove-line').addEventListener('click', function () { newTr.remove(); });
                }
            };
        }
        if (gameScorecardSaveBtn) gameScorecardSaveBtn.disabled = false;
        var scorecardModal = document.getElementById('gameScorecardModal');
        if (scorecardModal) {
            scorecardModal.querySelectorAll('.game-scorecard-tab-btn').forEach(function (b) {
                var isOur = b.getAttribute('data-scorecard-tab') === 'our';
                b.classList.toggle('active', isOur);
                b.setAttribute('aria-selected', isOur ? 'true' : 'false');
            });
            var panelOur = document.getElementById('scorecardPanelOur');
            var panelOpponent = document.getElementById('scorecardPanelOpponent');
            if (panelOur) panelOur.classList.add('active');
            if (panelOpponent) panelOpponent.classList.remove('active');
        }
    }

    function readIntFromEl(tr, sel) {
        var el = tr.querySelector(sel);
        return el && el.value !== undefined && el.value !== '' ? (parseInt(el.value, 10) || 0) : 0;
    }
    function readFloatFromEl(tr, sel) {
        var el = tr.querySelector(sel);
        return el && el.value !== undefined && el.value !== '' ? (parseFloat(el.value) || 0) : 0;
    }
    function readStrFromEl(tr, sel) {
        var el = tr.querySelector(sel);
        return el && el.value !== undefined ? String(el.value).trim() : '';
    }

    async function syncLeagueRecordsFromGameScorecard(scheduleId) {
        if (!scheduleId) return;
        var schedulesAll = await fetchSchedules(true);
        var current = (schedulesAll || []).filter(function (s) { return s && s.id === scheduleId; })[0];
        if (!current) return;

        var leagueId = normalizeLeagueId((current && current.leagueId) || 'nono');
        var leagueSchedules = filterSchedulesByLeague(schedulesAll || [], leagueId);
        leagueSchedules = filterSchedulesExcludeVenues(leagueSchedules);
        var ids = leagueSchedules.map(function (s) { return s && s.id ? s.id : ''; }).filter(Boolean);

        var battingLines = await dbListGameBattingLinesByScheduleIds(ids);
        var pitchingLines = await dbListGamePitchingLinesByScheduleIds(ids);

        var battingByPlayer = {};
        (battingLines || []).forEach(function (ln) {
            if (!ln || !ln.playerId) return;
            var pid = String(ln.playerId);
            if (!battingByPlayer[pid]) battingByPlayer[pid] = { pa: 0, ab: 0, h: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0 };
            var x = battingByPlayer[pid];
            x.pa += toInt(ln.pa);
            x.ab += toInt(ln.ab);
            x.h += toInt(ln.h);
            x.rbi += toInt(ln.rbi);
            x.r += toInt(ln.r);
            x.bb += toInt(ln.bb);
            x.so += toInt(ln.so);
            x.sb += toInt(ln.sb);
        });

        var pitchingByPlayer = {};
        (pitchingLines || []).forEach(function (ln) {
            if (!ln || !ln.playerId) return;
            var pid = String(ln.playerId);
            if (!pitchingByPlayer[pid]) pitchingByPlayer[pid] = { ip: 0, h: 0, er: 0, w: 0, l: 0, sv: 0 };
            var p = pitchingByPlayer[pid];
            p.ip += parseFloat(String(ln.ip || 0)) || 0;
            p.h += toInt(ln.h);
            p.er += toInt(ln.er);
            p.w += toInt(ln.w);
            p.l += toInt(ln.l);
            p.sv += toInt(ln.sv);
        });

        // 리그 기록은 경기기록지 기준으로 재집계해 정합성 유지(수정/삭제 시 중복 누적 방지)
        await dbDeletePersonalRecordsByLeague(leagueId);
        var personalRows = Object.keys(battingByPlayer).map(function (pid) {
            var x = battingByPlayer[pid];
            var pa = toInt(x.pa);
            var ab = toInt(x.ab);
            var h = toInt(x.h);
            return {
                leagueId: leagueId,
                playerId: pid,
                pa: pa > 0 ? pa : ab,
                ab: ab,
                h: h,
                rbi: toInt(x.rbi),
                r: toInt(x.r),
                bb: toInt(x.bb),
                so: toInt(x.so),
                sb: toInt(x.sb),
                avg: calcAvg(h, ab),
                updatedAt: Date.now()
            };
        });
        for (var i = 0; i < personalRows.length; i++) {
            await dbUpsertPersonalRecord(personalRows[i]);
        }

        await dbDeletePitcherRecordsByLeague(leagueId);
        var pitcherRows = Object.keys(pitchingByPlayer).map(function (pid) {
            var p = pitchingByPlayer[pid];
            return {
                leagueId: leagueId,
                playerId: pid,
                ip: parseFloat(String(p.ip || 0)),
                h: toInt(p.h),
                er: toInt(p.er),
                w: toInt(p.w),
                l: toInt(p.l),
                sv: toInt(p.sv),
                updatedAt: Date.now()
            };
        });
        for (var j = 0; j < pitcherRows.length; j++) {
            await dbUpsertPitcherRecord(pitcherRows[j]);
        }

        invalidateDbCache(['personal', 'pitcher']);
    }

    async function handleGameScorecardSave() {
        var scheduleId = currentScorecardScheduleId;
        if (!scheduleId) return;
        var battingLines = [];
        if (gameBattingLinesBody) {
            gameBattingLinesBody.querySelectorAll('tr.game-line-row').forEach(function (tr) {
                var sel = tr.querySelector('.game-line-player-select');
                var playerId = sel && sel.value ? sel.value.trim() : '';
                if (!playerId) return;
                var orderEl = tr.querySelector('.game-line-order');
                var orderVal = orderEl && orderEl.value !== undefined && orderEl.value !== '' ? parseInt(String(orderEl.value), 10) : null;
                battingLines.push({
                    playerId: playerId,
                    pa: 0,
                    ab: readIntFromEl(tr, '.game-line-ab'),
                    h: readIntFromEl(tr, '.game-line-h'),
                    rbi: readIntFromEl(tr, '.game-line-rbi'),
                    r: readIntFromEl(tr, '.game-line-r'),
                    bb: 0,
                    so: 0,
                    sb: readIntFromEl(tr, '.game-line-sb'),
                    battingOrder: (orderVal != null && !isNaN(orderVal)) ? orderVal : null,
                    inning_1: readStrFromEl(tr, '.game-line-inning-1'),
                    inning_2: readStrFromEl(tr, '.game-line-inning-2'),
                    inning_3: readStrFromEl(tr, '.game-line-inning-3'),
                    inning_4: readStrFromEl(tr, '.game-line-inning-4'),
                    inning_5: readStrFromEl(tr, '.game-line-inning-5'),
                    inning_6: readStrFromEl(tr, '.game-line-inning-6'),
                    inning_7: readStrFromEl(tr, '.game-line-inning-7'),
                    inning_8: readStrFromEl(tr, '.game-line-inning-8'),
                    inning_9: readStrFromEl(tr, '.game-line-inning-9'),
                    season_avg: (function () {
                        var el = tr.querySelector('.game-line-season-avg');
                        if (!el || el.value === undefined || el.value === '') return null;
                        var v = parseFloat(el.value);
                        return isNaN(v) ? null : v;
                    })()
                });
            });
        }
        var pitchingLines = [];
        if (gamePitchingLinesBody) {
            gamePitchingLinesBody.querySelectorAll('tr.game-line-row').forEach(function (tr) {
                var sel = tr.querySelector('.game-line-player-select');
                var playerId = sel && sel.value ? sel.value.trim() : '';
                if (!playerId) return;
                var ipVal = readFloatFromEl(tr, '.game-line-ip');
                pitchingLines.push({
                    playerId: playerId,
                    ip: isNaN(ipVal) ? 0 : ipVal,
                    h: readIntFromEl(tr, '.game-line-h'),
                    er: readIntFromEl(tr, '.game-line-er'),
                    w: readIntFromEl(tr, '.game-line-w'),
                    l: readIntFromEl(tr, '.game-line-l'),
                    sv: readIntFromEl(tr, '.game-line-sv'),
                    result: readStrFromEl(tr, '.game-line-result'),
                    bf: readIntFromEl(tr, '.game-line-bf'),
                    ab: readIntFromEl(tr, '.game-line-ab'),
                    hr: readIntFromEl(tr, '.game-line-hr'),
                    sh: readIntFromEl(tr, '.game-line-sh'),
                    sf: readIntFromEl(tr, '.game-line-sf'),
                    bb: readIntFromEl(tr, '.game-line-bb'),
                    hbp: readIntFromEl(tr, '.game-line-hbp'),
                    so: readIntFromEl(tr, '.game-line-so'),
                    wp: readIntFromEl(tr, '.game-line-wp'),
                    balk: readIntFromEl(tr, '.game-line-balk'),
                    r: readIntFromEl(tr, '.game-line-r'),
                    np: readIntFromEl(tr, '.game-line-np'),
                    season_era: (function () {
                        var el = tr.querySelector('.game-line-season-era');
                        if (!el || el.value === undefined || el.value === '') return null;
                        var v = parseFloat(el.value);
                        return isNaN(v) ? null : v;
                    })()
                });
            });
        }
        // 같은 선수 중복 선택 저장 방지(우리팀 기준)
        function findDuplicatePlayerId(lines) {
            var seen = {};
            for (var i = 0; i < (lines || []).length; i++) {
                var pid = lines[i] && lines[i].playerId ? String(lines[i].playerId) : '';
                if (!pid) continue;
                if (seen[pid]) return pid;
                seen[pid] = true;
            }
            return '';
        }
        function playerDisplayName(pid) {
            var p = (currentScorecardPlayers || []).filter(function (x) { return String(x.id) === String(pid); })[0];
            if (!p) return pid;
            return String(p.jerseyNo || '') + ' ' + String(p.name || '');
        }
        var dupBat = findDuplicatePlayerId(battingLines);
        if (dupBat) {
            alert('타자 기록에 동일 선수가 중복 선택되었습니다: ' + playerDisplayName(dupBat));
            return;
        }
        var dupPitch = findDuplicatePlayerId(pitchingLines);
        if (dupPitch) {
            alert('투수 기록에 동일 선수가 중복 선택되었습니다: ' + playerDisplayName(dupPitch));
            return;
        }
        var opponentBattingLines = [];
        if (gameOpponentBattingLinesBody) {
            gameOpponentBattingLinesBody.querySelectorAll('tr.game-opponent-row').forEach(function (tr) {
                var nameEl = tr.querySelector('.game-opponent-player-name');
                var playerName = nameEl && nameEl.value !== undefined ? String(nameEl.value).trim() : '';
                opponentBattingLines.push({
                    playerName: playerName,
                    ab: readIntFromEl(tr, '.game-line-ab'),
                    h: readIntFromEl(tr, '.game-line-h'),
                    rbi: readIntFromEl(tr, '.game-line-rbi'),
                    r: readIntFromEl(tr, '.game-line-r'),
                    sb: readIntFromEl(tr, '.game-line-sb'),
                    battingOrder: null,
                    inning_1: readStrFromEl(tr, '.game-line-inning-1'),
                    inning_2: readStrFromEl(tr, '.game-line-inning-2'),
                    inning_3: readStrFromEl(tr, '.game-line-inning-3'),
                    inning_4: readStrFromEl(tr, '.game-line-inning-4'),
                    inning_5: readStrFromEl(tr, '.game-line-inning-5'),
                    inning_6: readStrFromEl(tr, '.game-line-inning-6'),
                    inning_7: readStrFromEl(tr, '.game-line-inning-7'),
                    inning_8: readStrFromEl(tr, '.game-line-inning-8'),
                    inning_9: readStrFromEl(tr, '.game-line-inning-9'),
                    season_avg: (function () {
                        var el = tr.querySelector('.game-line-season-avg');
                        if (!el || el.value === undefined || el.value === '') return null;
                        var v = parseFloat(el.value);
                        return isNaN(v) ? null : v;
                    })()
                });
            });
        }
        var opponentPitchingLines = [];
        if (gameOpponentPitchingLinesBody) {
            gameOpponentPitchingLinesBody.querySelectorAll('tr.game-opponent-row').forEach(function (tr) {
                var nameEl = tr.querySelector('.game-opponent-player-name');
                var playerName = nameEl && nameEl.value !== undefined ? String(nameEl.value).trim() : '';
                var ipVal = readFloatFromEl(tr, '.game-line-ip');
                opponentPitchingLines.push({
                    playerName: playerName,
                    ip: isNaN(ipVal) ? 0 : ipVal,
                    h: readIntFromEl(tr, '.game-line-h'),
                    er: readIntFromEl(tr, '.game-line-er'),
                    w: readIntFromEl(tr, '.game-line-w'),
                    l: readIntFromEl(tr, '.game-line-l'),
                    sv: readIntFromEl(tr, '.game-line-sv'),
                    result: readStrFromEl(tr, '.game-line-result'),
                    bf: readIntFromEl(tr, '.game-line-bf'),
                    ab: readIntFromEl(tr, '.game-line-ab'),
                    hr: readIntFromEl(tr, '.game-line-hr'),
                    sh: readIntFromEl(tr, '.game-line-sh'),
                    sf: readIntFromEl(tr, '.game-line-sf'),
                    bb: readIntFromEl(tr, '.game-line-bb'),
                    hbp: readIntFromEl(tr, '.game-line-hbp'),
                    so: readIntFromEl(tr, '.game-line-so'),
                    wp: readIntFromEl(tr, '.game-line-wp'),
                    balk: readIntFromEl(tr, '.game-line-balk'),
                    r: readIntFromEl(tr, '.game-line-r'),
                    np: readIntFromEl(tr, '.game-line-np'),
                    season_era: (function () {
                        var el = tr.querySelector('.game-line-season-era');
                        if (!el || el.value === undefined || el.value === '') return null;
                        var v = parseFloat(el.value);
                        return isNaN(v) ? null : v;
                    })()
                });
            });
        }
        try {
            await dbReplaceGameBattingLines(scheduleId, battingLines);
            await dbReplaceGamePitchingLines(scheduleId, pitchingLines);
            await dbReplaceGameOpponentBattingLines(scheduleId, opponentBattingLines);
            await dbReplaceGameOpponentPitchingLines(scheduleId, opponentPitchingLines);
            await syncLeagueRecordsFromGameScorecard(scheduleId);
            await loadPersonalRecordsTable(true);
            await loadPitcherRecordsTable(true);
            await loadTeamRecordsTab(true);
            alert('저장되었습니다.');
        } catch (err) {
            console.error(err);
            alert('저장 중 오류가 났습니다. ' + (err && err.message ? err.message : ''));
        }
    }

    function closeScheduleAddModal() {
        editingScheduleId = null;
        if (scheduleDeleteBtn) scheduleDeleteBtn.style.display = 'none';
        closeModal('scheduleAddModal');
    }

    async function openScheduleListModal() {
        var end = new Date();
        var start = new Date(end);
        start.setMonth(start.getMonth() - 1);
        if (scheduleStartDate) scheduleStartDate.value = toInputDate(start);
        if (scheduleEndDate) scheduleEndDate.value = toInputDate(end);
        if (scheduleLeagueFilter) scheduleLeagueFilter.value = getSelectedLeague() || '';
        await runScheduleSearch(false);
        openModal('scheduleListModal');
    }

    function closeScheduleListModal() {
        closeModal('scheduleListModal');
    }

    async function runScheduleSearch(force) {
        var raw = await fetchSchedules(!!force);
        var leagueId = scheduleLeagueFilter && scheduleLeagueFilter.value !== undefined ? String(scheduleLeagueFilter.value || '') : getSelectedLeague();
        var startStr = scheduleStartDate && scheduleStartDate.value ? scheduleStartDate.value : '';
        var endStr = scheduleEndDate && scheduleEndDate.value ? scheduleEndDate.value : '';

        var list = filterSchedulesByLeague(raw, leagueId);
        list.sort(function (a, b) {
            var da = a.date ? new Date(a.date) : null;
            var db = b.date ? new Date(b.date) : null;
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return da.getTime() - db.getTime();
        });

        if (startStr || endStr) {
            var startDt = startStr ? new Date(startStr) : null;
            var endDt = endStr ? new Date(endStr) : null;
            if (startDt) startDt.setHours(0, 0, 0, 0);
            if (endDt) endDt.setHours(23, 59, 59, 999);
            list = list.filter(function (s) {
                var d = s.date ? new Date(s.date) : null;
                if (!d) return false;
                var t = d.getTime();
                if (startDt && t < startDt.getTime()) return false;
                if (endDt && t > endDt.getTime()) return false;
                return true;
            });
        }

        if (!scheduleFullList) return;
        if (list.length === 0) {
            scheduleFullList.innerHTML = '<div class="notice-empty">조건에 맞는 경기 일정이 없습니다.</div>';
            return;
        }

        scheduleFullList.innerHTML = list.map(function (s) {
            var dateTimeStr = formatScheduleDateTime(s.date, s.time);
            var bo = s.batOrder ? ('[' + escapeHtml(String(s.batOrder)) + '] ') : '';
            var lg = (!leagueId && s.leagueId) ? ('[' + escapeHtml(leagueName(s.leagueId)) + '] ') : '';
            return '<div class="schedule-full-item" data-schedule-id="' + escapeHtml(s.id || '') + '">' +
                '<span class="schedule-full-date">' + (dateTimeStr || '') + '</span>' +
                '<span class="schedule-full-vs">' + lg + bo + 'YAGUBU vs ' + escapeHtml(s.opponent || '') + '</span>' +
                '<span class="schedule-full-location">' + escapeHtml(s.location || '') + '</span>' +
                '<span class="schedule-status ' + escapeHtml(s.status || '예정') + '">' + escapeHtml(s.status || '예정') + '</span>' +
                '</div>';
        }).join('');

        scheduleFullList.querySelectorAll('.schedule-full-item').forEach(function (el) {
            el.addEventListener('click', withManage(function () {
                var id = el.getAttribute('data-schedule-id');
                if (!id) return;
                closeScheduleListModal();
                return openScheduleEditModal(id);
            }));
        });
    }

    function formatScheduleDateTime(dateStr, timeStr) {
        if (!dateStr) return '';
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        var weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        var dateFormatted = formatNoticeDate(d);
        var weekday = weekdays[d.getDay()];
        var timeFormatted = timeStr || '';
        return dateFormatted + ' (' + weekday + ') ' + timeFormatted;
    }

    var MAIN_SCHEDULE_LIMIT = 3;

    async function loadScheduleList(force) {
        var raw = await fetchSchedules(!!force);
        var leagueId = getSelectedLeague();
        // 진행완료된 경기는 제외
        var incomplete = raw.filter(function (s) {
            return s.status !== '완료';
        });
        incomplete = filterSchedulesByLeague(incomplete, leagueId);
        // 날짜순 정렬 (가까운 날짜부터)
        incomplete.sort(function (a, b) {
            var da = a.date ? new Date(a.date) : null;
            var db = b.date ? new Date(b.date) : null;
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return da.getTime() - db.getTime();
        });
        var show = incomplete.slice(0, MAIN_SCHEDULE_LIMIT);

        // 다음 경기 D-day (첫 번째 예정 경기 기준) — 항상 표시
        var ddayText = '다음 경기 없음';
        if (incomplete.length > 0) {
            var next = incomplete[0];
            var gameDateStr = next.date;
            if (gameDateStr) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                var gameDate = new Date(String(gameDateStr).replace(/-/g, '/') + ' 00:00:00');
                gameDate.setHours(0, 0, 0, 0);
                var diffMs = gameDate.getTime() - today.getTime();
                var diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
                if (diffDays === 0) ddayText = 'D-day';
                else if (diffDays > 0) ddayText = 'D-' + diffDays;
                else ddayText = 'D+' + Math.abs(diffDays);
            }
        }
        if (scheduleDday) scheduleDday.textContent = ddayText;
        if (scheduleDdayWrap) scheduleDdayWrap.style.display = 'flex';

        if (!scheduleList) return;
        if (show.length === 0) {
            scheduleList.innerHTML = '<div class="schedule-empty">등록된 경기 일정이 없습니다.</div>';
            return;
        }

        scheduleList.innerHTML = show.map(function (s) {
            var dateTimeStr = formatScheduleDateTime(s.date, s.time);
            var bo = s.batOrder ? ('[' + escapeHtml(String(s.batOrder)) + '] ') : '';
            var lg = (!leagueId && s.leagueId) ? ('[' + escapeHtml(leagueName(s.leagueId)) + '] ') : '';
            return '<div class="schedule-item" data-schedule-id="' + escapeHtml(s.id || '') + '">' +
                '<div class="schedule-item-header">' +
                '<div class="schedule-vs">' + lg + bo + 'YAGUBU vs ' + escapeHtml(s.opponent || '') + '</div>' +
                '<span class="schedule-status ' + escapeHtml(s.status || '예정') + '">' + escapeHtml(s.status || '예정') + '</span>' +
                '</div>' +
                '<div class="schedule-item-details">' +
                '<div class="schedule-date-time">' + dateTimeStr + '</div>' +
                '<div class="schedule-location">' + escapeHtml(s.location || '') + '</div>' +
                '</div>' +
                '</div>';
        }).join('');

        scheduleList.querySelectorAll('.schedule-item').forEach(function (el) {
            el.addEventListener('click', withManage(function () {
                var id = el.getAttribute('data-schedule-id');
                if (id) return openScheduleEditModal(id);
            }));
        });
    }

    /** 완료 경기에서 result가 없어도 스코어로 승/패/무 산출 (시즌전적·그리드 표시용) */
    function getResultFromSchedule(s) {
        if (!s) return '';
        var r = (s.result || '').trim();
        if (r === '승' || r === '패' || r === '무') return r;
        if ((s.status || '') !== '완료') return '';
        var our = parseInt(s.ourScore, 10);
        var opp = parseInt(s.opponentScore, 10);
        if (isNaN(our) || isNaN(opp)) return '';
        if (our > opp) return '승';
        if (our < opp) return '패';
        return '무';
    }

    function scheduleResultDisplay(s) {
        var status = s.status || '예정';
        if (status === '예정') return { label: '경기예정', cls: 'scheduled' };
        if (status === '진행중') return { label: '진행중', cls: 'scheduled' };
        if (status === '완료') {
            var result = getResultFromSchedule(s);
            if (result === '승') return { label: '승', cls: 'win' };
            if (result === '패') return { label: '패', cls: 'loss' };
            if (result === '무') return { label: '무', cls: 'draw' };
            return { label: '완료', cls: 'scheduled' };
        }
        return { label: '경기예정', cls: 'scheduled' };
    }

    async function loadSeasonScheduleTable(force) {
        if (!seasonScheduleTableBody) return;
        var leagueId = getSelectedLeague();
        var raw = filterSchedulesByLeague(await fetchSchedules(!!force), leagueId);
        raw.sort(function (a, b) {
            // 오름차순(가까운 경기부터) + 시간까지 고려
            var da = (a && a.date) ? new Date(String(a.date) + 'T' + String(a.time || '00:00')) : null;
            var db = (b && b.date) ? new Date(String(b.date) + 'T' + String(b.time || '00:00')) : null;
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return da.getTime() - db.getTime();
        });
        if (raw.length === 0) {
            seasonScheduleTableBody.innerHTML = '<tr><td colspan="6" class="schedule-table-empty">등록된 경기가 없습니다.</td></tr>';
            return;
        }
        seasonScheduleTableBody.innerHTML = raw.map(function (s) {
            var dt = formatScheduleDateTime(s.date, s.time);
            var bo = s.batOrder ? ('[' + escapeHtml(String(s.batOrder)) + '] ') : '';
            var lg = (!leagueId && s.leagueId) ? ('[' + escapeHtml(leagueName(s.leagueId)) + '] ') : '';
            var vs = lg + bo + 'YAGUBU vs ' + escapeHtml(s.opponent || '');
            var loc = escapeHtml(s.location || '');
            var res = scheduleResultDisplay(s);
            var scoreStr = '';
            if (s.status === '완료' && (s.ourScore !== undefined && s.ourScore !== '') && (s.opponentScore !== undefined && s.opponentScore !== '')) {
                scoreStr = ' <span class="schedule-score-badge">' + escapeHtml(String(s.ourScore)) + ':' + escapeHtml(String(s.opponentScore)) + '</span>';
            }
            return '<tr class="schedule-table-row" data-schedule-id="' + escapeHtml(s.id || '') + '" title="더블클릭: 상세 확인 및 수정">' +
                '<td>' + escapeHtml(dt || '') + '</td>' +
                '<td>' + vs + '</td>' +
                '<td>' + loc + '</td>' +
                '<td><span class="status-badge ' + res.cls + '">' + escapeHtml(res.label) + '</span>' + scoreStr + '</td>' +
                '<td><span class="detail-icon">🔍</span></td>' +
                '<td><button type="button" class="btn btn-scorecard" data-schedule-id="' + escapeHtml(s.id || '') + '" title="경기 기록지">📋 기록지</button></td></tr>';
        }).join('');
        seasonScheduleTableBody.querySelectorAll('.schedule-table-row').forEach(function (el) {
            el.addEventListener('dblclick', withManage(function () {
                var id = el.getAttribute('data-schedule-id');
                if (id) return openScheduleEditModal(id);
            }));
        });
        seasonScheduleTableBody.querySelectorAll('.btn-scorecard').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var id = btn.getAttribute('data-schedule-id');
                if (id) openGameScorecardModal(id);
            });
        });
    }

    async function loadSeasonStats(force) {
        var leagueId = getSelectedLeague();
        var raw = filterSchedulesByLeague(await fetchSchedules(!!force), leagueId);
        raw = filterSchedulesExcludeVenues(raw); // 시범경기·올스타 구장 제외
        var completed = raw.filter(function (s) { return s.status === '완료'; });
        var wins = 0, losses = 0, draws = 0;
        completed.forEach(function (s) {
            var r = getResultFromSchedule(s);
            if (r === '승') wins += 1;
            else if (r === '패') losses += 1;
            else if (r === '무') draws += 1;
        });
        var total = wins + losses + draws;
        var rate = total > 0 ? Math.round((wins / total) * 100) : 0;
        if (statsLeagueLabel) statsLeagueLabel.textContent = leagueId ? leagueName(leagueId) : '전체';
        if (statsWinRate) statsWinRate.textContent = rate + '%';
        if (statsWin) statsWin.textContent = String(wins) + '승';
        if (statsLoss) statsLoss.textContent = String(losses) + '패';
        if (statsDraw) statsDraw.textContent = String(draws) + '무';
    }

    function exportToExcelHelper(wb, filename) {
        if (typeof XLSX === 'undefined') {
            alert('엑셀 라이브러리를 불러올 수 없습니다.');
            return;
        }
        try {
            XLSX.writeFile(wb, filename + '.xlsx');
        } catch (e) {
            alert('엑셀 저장 중 오류가 발생했습니다: ' + (e && e.message ? e.message : String(e)));
        }
    }

    async function exportToExcelSchedule() {
        if (typeof XLSX === 'undefined') { alert('엑셀 라이브러리를 불러올 수 없습니다.'); return; }
        showLoadingOverlay();
        try {
            var leagueId = getSelectedLeague();
            var raw = filterSchedulesByLeague(await fetchSchedules(true), leagueId);
            raw.sort(function (a, b) {
                var da = (a && a.date) ? new Date(String(a.date) + 'T' + String(a.time || '00:00')) : null;
                var db = (b && b.date) ? new Date(String(b.date) + 'T' + String(b.time || '00:00')) : null;
                if (!da && !db) return 0;
                if (!da) return 1;
                if (!db) return -1;
                return da.getTime() - db.getTime();
            });
            var rows = [['날짜/시간', '대전', '구장', '성적', '스코어']];
            raw.forEach(function (s) {
                var dt = formatScheduleDateTime(s.date, s.time);
                var bo = s.batOrder ? ('[' + String(s.batOrder) + '] ') : '';
                var lg = (!leagueId && s.leagueId) ? ('[' + (leagueName(s.leagueId) || '') + '] ') : '';
                var vs = lg + bo + 'YAGUBU vs ' + (s.opponent || '');
                var loc = s.location || '';
                var res = scheduleResultDisplay(s);
                var scoreStr = '';
                if (s.status === '완료' && s.ourScore !== undefined && s.opponentScore !== undefined) {
                    scoreStr = String(s.ourScore) + ':' + String(s.opponentScore);
                }
                rows.push([dt || '', vs, loc, res.label, scoreStr]);
            });
            if (rows.length <= 1) {
                alert('다운로드할 경기 일정이 없습니다.');
                return;
            }
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.aoa_to_sheet(rows);
            XLSX.utils.book_append_sheet(wb, ws, '경기일정');
            exportToExcelHelper(wb, 'YAGUBU_경기일정_' + new Date().toISOString().slice(0, 10));
        } finally {
            hideLoadingOverlay();
        }
    }

    async function exportToExcelTeam() {
        if (typeof XLSX === 'undefined') { alert('엑셀 라이브러리를 불러올 수 없습니다.'); return; }
        showLoadingOverlay();
        try {
            seedPlayersIfEmpty();
            var players = (await fetchPlayers(true)).filter(isPlayerForRecords);
            var leagueId = getSelectedLeague();
            var recs = recordsForLeague(await fetchPersonalRecords(true), leagueId);
            var pitcherRecs = pitcherRecordsForLeague(await fetchPitcherRecords(true), leagueId);
            var schedules = filterSchedulesByLeague(await fetchSchedules(true), leagueId);
            var summary = computeTeamRecords(players, recs, schedules, pitcherRecs);

            var wb = XLSX.utils.book_new();
            var ws1 = XLSX.utils.aoa_to_sheet([
                ['팀 기록실'],
                ['팀 타율', summary.teamAvg],
                ['팀 방어율', summary.teamEra],
                ['최근 전적', summary.recentW + '승 ' + summary.recentL + '패']
            ]);
            XLSX.utils.book_append_sheet(wb, ws1, '팀기록실');

            function buildAllRows(metricKey) {
                var recById = {};
                (recs || []).forEach(function (r) { if (r && r.playerId) recById[String(r.playerId)] = r; });
                var items = players.map(function (p) {
                    var r = recById[p.id];
                    var ab = r ? toInt(r.ab) : 0;
                    var h = r ? toInt(r.h) : 0;
                    var rbi = r ? toInt(r.rbi) : 0;
                    var sb = r ? toInt(r.sb) : 0;
                    var avg = r ? (r.avg || calcAvg(h, ab)) : calcAvg(0, 0);
                    var val = (metricKey === 'avg') ? parseFloat(avg) : (metricKey === 'h' ? h : (metricKey === 'rbi' ? rbi : sb));
                    return { jerseyNo: p.jerseyNo || '', name: p.name || '', avg: avg, h: h, rbi: rbi, sb: sb, sortVal: val };
                });
                items.sort(function (a, b) {
                    if (b.sortVal !== a.sortVal) return (b.sortVal - a.sortVal);
                    return toInt(a.jerseyNo) - toInt(b.jerseyNo);
                });
                return items;
            }

            var titles = { avg: '타율', h: '안타', rbi: '타점', sb: '도루' };
            ['avg', 'h', 'rbi', 'sb'].forEach(function (key) {
                var items = buildAllRows(key);
                var rows = [['순위', '등번호', '성명', titles[key]]];
                items.forEach(function (r, idx) {
                    var stat = key === 'avg' ? r.avg : (key === 'h' ? r.h : (key === 'rbi' ? r.rbi : r.sb));
                    rows.push([idx + 1, r.jerseyNo, r.name, stat]);
                });
                var ws = XLSX.utils.aoa_to_sheet(rows);
                XLSX.utils.book_append_sheet(wb, ws, titles[key] + '순위');
            });
            exportToExcelHelper(wb, 'YAGUBU_팀기록_' + new Date().toISOString().slice(0, 10));
        } finally {
            hideLoadingOverlay();
        }
    }

    function exportToExcelPersonal() {
        if (typeof XLSX === 'undefined') { alert('엑셀 라이브러리를 불러올 수 없습니다.'); return; }
        var table = personalRecordTableBody ? personalRecordTableBody.closest('table') : null;
        if (!table || !table.querySelector('thead')) {
            alert('다운로드할 개인 기록이 없습니다.');
            return;
        }
        var trs = table.querySelectorAll('tbody tr');
        if (!trs || trs.length === 0 || (trs.length === 1 && trs[0].querySelector('.schedule-table-empty'))) {
            alert('다운로드할 개인 기록이 없습니다.');
            return;
        }
        showLoadingOverlay();
        try {
            var ws = XLSX.utils.table_to_sheet(table);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '개인기록');
            exportToExcelHelper(wb, 'YAGUBU_개인기록_' + new Date().toISOString().slice(0, 10));
        } finally {
            hideLoadingOverlay();
        }
    }

    function exportToExcelPitcher() {
        if (typeof XLSX === 'undefined') { alert('엑셀 라이브러리를 불러올 수 없습니다.'); return; }
        var table = pitcherRecordTableBody ? pitcherRecordTableBody.closest('table') : null;
        if (!table || !table.querySelector('thead')) {
            alert('다운로드할 투수 기록이 없습니다.');
            return;
        }
        var trs = table.querySelectorAll('tbody tr');
        if (!trs || trs.length === 0 || (trs.length === 1 && trs[0].querySelector('.schedule-table-empty'))) {
            alert('다운로드할 투수 기록이 없습니다.');
            return;
        }
        showLoadingOverlay();
        try {
            var ws = XLSX.utils.table_to_sheet(table);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '투수기록');
            exportToExcelHelper(wb, 'YAGUBU_투수기록_' + new Date().toISOString().slice(0, 10));
        } finally {
            hideLoadingOverlay();
        }
    }

    async function handleScheduleAddSubmit(e) {
        e.preventDefault();
        var leagueId = scheduleLeague && scheduleLeague.value ? normalizeLeagueId(scheduleLeague.value) : (getSelectedLeague() || 'nono');
        var dateVal = scheduleDate.value;
        var timeVal = scheduleTime.value;
        var opponent = (scheduleOpponent.value || '').trim();
        var location = (scheduleLocation.value || '').trim();
        var status = scheduleStatus.value;
        var batOrder = scheduleBatOrder && scheduleBatOrder.value ? scheduleBatOrder.value : '선공';

        if (!dateVal) {
            alert('경기일을 선택해 주세요.');
            scheduleDate.focus();
            return;
        }
        if (!timeVal) {
            alert('경기 시간을 입력해 주세요.');
            scheduleTime.focus();
            return;
        }
        if (!opponent) {
            alert('상대팀을 입력해 주세요.');
            scheduleOpponent.focus();
            return;
        }
        if (!location) {
            alert('구장을 입력해 주세요.');
            scheduleLocation.focus();
            return;
        }

        var resultVal = scheduleResult && scheduleStatus.value === '완료' ? (scheduleResult.value || '') : '';
        var ourVal = '';
        var oppVal = '';
        if (scheduleStatus.value === '완료') {
            if (scheduleOurScore && scheduleOurScore.value.trim() !== '') ourVal = scheduleOurScore.value.trim();
            if (scheduleOpponentScore && scheduleOpponentScore.value.trim() !== '') oppVal = scheduleOpponentScore.value.trim();
        }
        var saved = null;
        if (isDbMode()) {
            saved = {
                id: editingScheduleId || ('s_' + Date.now()),
                leagueId: leagueId,
                date: dateVal,
                time: timeVal,
                opponent: opponent,
                location: location,
                status: status,
                batOrder: batOrder,
                result: resultVal,
                ourScore: ourVal,
                opponentScore: oppVal,
                createdAt: Date.now()
            };
            await dbUpsertSchedule(saved);
            invalidateDbCache(['schedules']);
        } else {
            var schedules = getSchedules();
            if (editingScheduleId) {
                var idx = schedules.findIndex(function (x) { return x.id === editingScheduleId; });
                if (idx !== -1) {
                    saved = {
                        id: schedules[idx].id,
                        leagueId: schedules[idx].leagueId || leagueId,
                        date: dateVal,
                        time: timeVal,
                        opponent: opponent,
                        location: location,
                        status: status,
                        batOrder: batOrder,
                        result: resultVal,
                        ourScore: ourVal,
                        opponentScore: oppVal,
                        createdAt: schedules[idx].createdAt || Date.now()
                    };
                    schedules[idx] = saved;
                    saveSchedules(schedules);
                }
            } else {
                saved = {
                    id: 's_' + Date.now(),
                    leagueId: leagueId,
                    date: dateVal,
                    time: timeVal,
                    opponent: opponent,
                    location: location,
                    status: status,
                    batOrder: batOrder,
                    result: resultVal,
                    ourScore: ourVal,
                    opponentScore: oppVal,
                    createdAt: Date.now()
                };
                schedules.unshift(saved);
                saveSchedules(schedules);
            }
        }

        await loadScheduleList(true);
        await loadSeasonScheduleTable(true);
        await loadSeasonStats(true);
        await loadTeamRecordsTab(true);
        await runScheduleSearch(true);
        closeScheduleAddModal();
    }

    async function handleScheduleDelete() {
        if (!editingScheduleId) return;
        if (!confirm('이 경기 일정을 삭제하시겠습니까?')) return;
        await dbDeleteSchedule(editingScheduleId);
        invalidateDbCache(['schedules']);
        editingScheduleId = null;
        closeScheduleAddModal();
        await loadScheduleList(true);
        await loadSeasonScheduleTable(true);
        await loadSeasonStats(true);
        await loadTeamRecordsTab(true);
        await runScheduleSearch(true);
        alert('삭제되었습니다.');
    }

    function getYoutubeVideoId(url) {
        if (!url) return '';
        var u = url.trim();
        var m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        return m ? m[1] : '';
    }

    function getYoutubeEmbedUrl(url) {
        var id = getYoutubeVideoId(url);
        return id ? 'https://www.youtube.com/embed/' + id : '';
    }

    function mediaIcon(type) {
        if (type === '유튜브') return '▶';
        if (type === '동영상') return '🎬';
        if (type === '사진') return '🖼';
        return '📷';
    }

    function renderMediaItemHtml(m, cssClass) {
        var title = m.title || '(제목 없음)';
        var isImg = m.type === '사진' && m.url;
        var thumb = isImg
            ? '<img class="media-item-thumb" src="' + escapeHtml(m.url) + '" alt="">'
            : '<span class="media-item-icon">' + mediaIcon(m.type) + '</span>';
        return '<div class="' + (cssClass || 'media-item') + '" data-media-id="' + escapeHtml(m.id || '') + '" title="더블클릭: 미리보기">' +
            thumb +
            '<span class="media-item-label">' + escapeHtml(title) + '</span>' +
            '</div>';
    }

    var MAIN_MEDIA_LIMIT = 4;

    async function loadMediaList(force) {
        var raw = await fetchMedia(!!force);
        var list = raw.slice();
        list.sort(function (a, b) {
            var ta = a.createdAt || 0;
            var tb = b.createdAt || 0;
            return tb - ta;
        });
        var show = list.slice(0, MAIN_MEDIA_LIMIT);

        if (!mediaList) return;
        if (show.length === 0) {
            mediaList.innerHTML = '<div class="media-empty">등록된 미디어가 없습니다.</div>';
            return;
        }

        mediaList.innerHTML = show.map(function (m) { return renderMediaItemHtml(m); }).join('');
        attachMediaClickHandlers(mediaList, '.media-item');
    }

    function switchMediaTypeRows() {
        var t = mediaType ? mediaType.value : '';
        if (mediaRowPhoto) mediaRowPhoto.style.display = t === '사진' ? '' : 'none';
        if (mediaRowVideo) mediaRowVideo.style.display = t === '동영상' ? '' : 'none';
        if (mediaRowYoutube) mediaRowYoutube.style.display = t === '유튜브' ? '' : 'none';
        if (mediaPhotoFile) mediaPhotoFile.value = '';
        if (mediaVideoUrl) mediaVideoUrl.value = '';
        if (mediaYoutubeUrl) mediaYoutubeUrl.value = '';
        if (mediaPhotoPreview) mediaPhotoPreview.style.display = 'none';
    }

    function setMediaEditButtonState(enabled) {
        if (mediaEditBtn) {
            mediaEditBtn.disabled = !enabled;
            if (enabled) {
                mediaEditBtn.style.opacity = '1';
                mediaEditBtn.style.cursor = 'pointer';
            } else {
                mediaEditBtn.style.opacity = '0.5';
                mediaEditBtn.style.cursor = 'not-allowed';
            }
        }
    }

    function selectMediaItem(mediaId) {
        selectedMediaId = mediaId;
        // 수정 버튼은 권한자만 활성화
        setMediaEditButtonState(canManage());
        document.querySelectorAll('.media-item, .media-full-item').forEach(function (el) {
            if (el.getAttribute('data-media-id') === mediaId) {
                el.classList.add('media-item-selected');
            } else {
                el.classList.remove('media-item-selected');
            }
        });
    }

    function clearMediaSelection() {
        selectedMediaId = null;
        setMediaEditButtonState(false);
        document.querySelectorAll('.media-item-selected').forEach(function (el) {
            el.classList.remove('media-item-selected');
        });
    }

    function openMediaAddModal() {
        editingMediaId = null;
        selectedMediaId = null;
        setMediaEditButtonState(false);
        if (mediaDeleteBtn) mediaDeleteBtn.style.display = 'none';
        if (mediaModalTitle) mediaModalTitle.textContent = '미디어 등록';
        mediaType.value = '동영상';
        mediaTitle.value = '';
        switchMediaTypeRows();
        mediaTitle.focus();
        openModal('mediaAddModal');
    }

    async function openMediaEditModal() {
        if (!selectedMediaId) return;
        var arr = await fetchMedia(false);
        var m = arr.filter(function (x) { return x.id === selectedMediaId; })[0];
        if (!m) {
            alert('선택한 미디어를 찾을 수 없습니다.');
            clearMediaSelection();
            return;
        }
        editingMediaId = selectedMediaId;
        if (mediaModalTitle) mediaModalTitle.textContent = '미디어 수정';
        if (mediaDeleteBtn) mediaDeleteBtn.style.display = '';
        mediaType.value = m.type || '동영상';
        mediaTitle.value = m.title || '';
        switchMediaTypeRows();
        if (m.type === '사진' && m.url) {
            if (mediaPhotoPreview && mediaPhotoPreviewImg) {
                mediaPhotoPreviewImg.src = m.url;
                mediaPhotoPreview.style.display = '';
            }
            if (mediaPhotoFile) mediaPhotoFile.removeAttribute('required');
        } else if (m.type === '동영상' && m.url) {
            if (mediaVideoUrl) mediaVideoUrl.value = m.url;
        } else if (m.type === '유튜브' && m.url) {
            if (mediaYoutubeUrl) mediaYoutubeUrl.value = m.url;
        }
        closeMediaListModal();
        mediaTitle.focus();
        openModal('mediaAddModal');
    }

    function closeMediaAddModal() {
        editingMediaId = null;
        if (mediaPhotoPreview) mediaPhotoPreview.style.display = 'none';
        if (mediaPhotoFile) mediaPhotoFile.setAttribute('required', 'required');
        if (mediaDeleteBtn) mediaDeleteBtn.style.display = 'none';
        closeModal('mediaAddModal');
    }

    async function openMediaListModal() {
        if (mediaFilterType) mediaFilterType.value = '';
        await runMediaSearch(false);
        openModal('mediaListModal');
    }

    function closeMediaListModal() {
        closeModal('mediaListModal');
    }

    async function runMediaSearch(force) {
        var raw = await fetchMedia(!!force);
        var typeFilter = mediaFilterType && mediaFilterType.value ? mediaFilterType.value : '';
        var list = raw.slice();
        list.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
        if (typeFilter) list = list.filter(function (m) { return m.type === typeFilter; });

        if (!mediaFullList) return;
        if (list.length === 0) {
            mediaFullList.innerHTML = '<div class="media-empty">조건에 맞는 미디어가 없습니다.</div>';
            return;
        }
        mediaFullList.innerHTML = list.map(function (m) { return renderMediaItemHtml(m, 'media-full-item'); }).join('');
        attachMediaClickHandlers(mediaFullList, '.media-full-item');
    }

    function attachMediaClickHandlers(container, selector) {
        if (!container) return;
        container.querySelectorAll(selector).forEach(function (el) {
            el.addEventListener('click', withAuth(function () {
                var id = el.getAttribute('data-media-id');
                if (id) selectMediaItem(id);
            }));
            el.addEventListener('dblclick', withAuth(function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                var id = el.getAttribute('data-media-id');
                if (!id) return;
                return fetchMedia(false).then(function (arr) {
                    var m = (arr || []).filter(function (x) { return x && x.id === id; })[0];
                    if (m) openMediaPreviewModal(m);
                });
            }));
        });
    }

    function openMediaPreviewModal(m) {
        var title = m.title || '(제목 없음)';
        if (mediaPreviewTitle) mediaPreviewTitle.textContent = title;
        if (!mediaPreviewContent) return;
        mediaPreviewContent.innerHTML = '';

        var embed = getYoutubeEmbedUrl(m.url);
        if (m.type === '유튜브' && embed) {
            var iframe = document.createElement('iframe');
            iframe.src = embed;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            mediaPreviewContent.appendChild(iframe);
            if (mediaYoutubeLink) {
                mediaYoutubeLink.href = m.url || '#';
                mediaYoutubeLink.style.display = 'inline-flex';
            }
        } else if (m.type === '동영상' && m.url) {
            var vid = document.createElement('video');
            vid.src = m.url;
            vid.controls = true;
            mediaPreviewContent.appendChild(vid);
            if (mediaYoutubeLink) mediaYoutubeLink.style.display = 'none';
        } else if (m.type === '사진' && m.url) {
            var img = document.createElement('img');
            img.src = m.url;
            img.alt = title;
            mediaPreviewContent.appendChild(img);
            if (mediaYoutubeLink) mediaYoutubeLink.style.display = 'none';
        } else {
            mediaPreviewContent.innerHTML = '<span class="media-item-icon">' + mediaIcon(m.type) + '</span><p style="color:#888;">미리보기를 지원하지 않습니다.</p>';
            if (mediaYoutubeLink) mediaYoutubeLink.style.display = 'none';
        }

        openModal('mediaPreviewModal');
    }

    function closeMediaPreviewModal() {
        if (mediaPreviewContent) mediaPreviewContent.innerHTML = '';
        if (mediaYoutubeLink) { mediaYoutubeLink.href = '#'; mediaYoutubeLink.style.display = 'none'; }
        closeModal('mediaPreviewModal');
    }

    async function saveNewMediaItem(typeVal, titleVal, urlVal) {
        if (isDbMode()) {
            var saved = {
                id: editingMediaId || ('m_' + Date.now()),
                type: typeVal,
                title: titleVal,
                url: urlVal,
                createdAt: Date.now()
            };
            await dbUpsertMedia(saved);
            invalidateDbCache(['media']);
            await loadMediaList(true);
            await runMediaSearch(true);
            clearMediaSelection();
            closeMediaAddModal();
            return;
        }

        var arr = getMedia();
        if (editingMediaId) {
            var idx = arr.findIndex(function (x) { return x.id === editingMediaId; });
            if (idx !== -1) {
                var updated = {
                    id: arr[idx].id,
                    type: typeVal,
                    title: titleVal,
                    url: urlVal,
                    createdAt: arr[idx].createdAt || Date.now()
                };
                arr[idx] = updated;
                saveMedia(arr);
                await loadMediaList(true);
                await runMediaSearch(true);
                clearMediaSelection();
                closeMediaAddModal();
                return;
            }
        }
        var newItem = {
            id: 'm_' + Date.now(),
            type: typeVal,
            title: titleVal,
            url: urlVal,
            createdAt: Date.now()
        };
        arr.unshift(newItem);
        saveMedia(arr);
        await loadMediaList(true);
        closeMediaAddModal();
    }

    async function handleMediaDelete() {
        if (!editingMediaId) return;
        if (!confirm('이 미디어를 삭제하시겠습니까?')) return;
        await dbDeleteMedia(editingMediaId);
        invalidateDbCache(['media']);
        editingMediaId = null;
        clearMediaSelection();
        closeMediaAddModal();
        await loadMediaList(true);
        await runMediaSearch(true);
        alert('삭제되었습니다.');
    }

    async function handleMediaAddSubmit(e) {
        e.preventDefault();
        var typeVal = mediaType.value;
        var titleVal = (mediaTitle.value || '').trim();

        if (!titleVal) {
            alert('제목을 입력해 주세요.');
            mediaTitle.focus();
            return;
        }

        if (typeVal === '사진') {
            if (editingMediaId) {
                var arr = await fetchMedia(false);
                var existing = arr.filter(function (x) { return x.id === editingMediaId; })[0];
                var photoUrl = existing && existing.url ? existing.url : '';
                if (mediaPhotoFile && mediaPhotoFile.files && mediaPhotoFile.files[0]) {
                    var file = mediaPhotoFile.files[0];
                    var fr = new FileReader();
                    fr.onload = function () {
                        saveNewMediaItem(typeVal, titleVal, fr.result).catch(function (err) { console.error(err); alert('저장 중 오류가 발생했습니다.'); });
                    };
                    fr.onerror = function () {
                        alert('사진을 읽는 중 오류가 발생했습니다.');
                    };
                    fr.readAsDataURL(file);
                } else {
                    if (!photoUrl) {
                        alert('사진 파일을 선택해 주세요.');
                        return;
                    }
                    await saveNewMediaItem(typeVal, titleVal, photoUrl);
                }
            } else {
                if (!mediaPhotoFile || !mediaPhotoFile.files || !mediaPhotoFile.files[0]) {
                    alert('사진 파일을 선택해 주세요.');
                    return;
                }
                var file = mediaPhotoFile.files[0];
                var fr = new FileReader();
                fr.onload = function () {
                    saveNewMediaItem(typeVal, titleVal, fr.result).catch(function (err) { console.error(err); alert('저장 중 오류가 발생했습니다.'); });
                };
                fr.onerror = function () {
                    alert('사진을 읽는 중 오류가 발생했습니다.');
                };
                fr.readAsDataURL(file);
            }
            return;
        }

        if (typeVal === '동영상') {
            var videoUrl = (mediaVideoUrl && mediaVideoUrl.value ? mediaVideoUrl.value : '').trim();
            if (!videoUrl) {
                alert('동영상 URL을 입력해 주세요.');
                if (mediaVideoUrl) mediaVideoUrl.focus();
                return;
            }
            await saveNewMediaItem(typeVal, titleVal, videoUrl);
            return;
        }

        if (typeVal === '유튜브') {
            var ytUrl = (mediaYoutubeUrl && mediaYoutubeUrl.value ? mediaYoutubeUrl.value : '').trim();
            if (!ytUrl) {
                alert('유튜브 URL을 입력해 주세요.');
                if (mediaYoutubeUrl) mediaYoutubeUrl.focus();
                return;
            }
            await saveNewMediaItem(typeVal, titleVal, ytUrl);
            return;
        }

        alert('유형을 선택해 주세요.');
    }

    function setupSeasonTabs() {
        var btns = document.querySelectorAll('.season-tabs .tab-btn');
        var panels = document.querySelectorAll('.tab-panels .tab-panel');
        btns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                if (!requireLogin(e)) return;
                var tab = btn.getAttribute('data-tab');
                if (!tab) return;
                btns.forEach(function (b) { b.classList.remove('active'); });
                panels.forEach(function (p) { p.classList.remove('active'); });
                btn.classList.add('active');
                var panel = document.getElementById('tab-' + tab);
                if (panel) panel.classList.add('active');
            });
        });
    }

    function setupModals() {
        document.querySelectorAll('[data-close]').forEach(function (el) {
            el.addEventListener('click', function () {
                var id = el.getAttribute('data-close');
                if (id === 'noticeAddModal') closeNoticeAddModal();
                else if (id === 'noticeListModal') closeNoticeListModal();
                else if (id === 'communityAddModal') closeCommunityAddModal();
                else if (id === 'communityListModal') closeCommunityListModal();
                else if (id === 'communityViewModal') closeCommunityViewModal();
                else if (id === 'galleryAddModal') closeGalleryAddModal();
                else if (id === 'galleryListModal') closeGalleryListModal();
                else if (id === 'galleryViewModal') closeGalleryViewModal();
                else if (id === 'scheduleAddModal') closeScheduleAddModal();
                else if (id === 'scheduleListModal') closeScheduleListModal();
                else if (id === 'gameScorecardModal') { currentScorecardScheduleId = null; closeModal('gameScorecardModal'); }
                else if (id === 'personalRecordModal') closePersonalRecordModal();
                else if (id === 'personalRecordListModal') closePersonalRecordListModal();
                else if (id === 'pitcherRecordModal') closePitcherRecordModal();
                else if (id === 'pitcherRecordListModal') closePitcherRecordListModal();
                else if (id === 'teamStoryModal') closeTeamStoryModal();
                else if (id === 'teamValuesModal') closeTeamValuesModal();
                else if (id === 'teamHistoryModal') closeTeamHistoryModal();
                else if (id === 'teamHistoryListModal') closeTeamHistoryListModal();
                else if (id === 'teamHistoryRowModal') closeTeamHistoryRowModal();
                else if (id === 'playerModal') closePlayerModal();
                else if (id === 'playerListModal') closePlayerListModal();
                else if (id === 'mediaAddModal') closeMediaAddModal();
                else if (id === 'mediaListModal') closeMediaListModal();
                else if (id === 'mediaPreviewModal') closeMediaPreviewModal();
                else if (id === 'loginModal') closeLoginModal();
            });
        });
    }

    async function syncAllFromSupabase() {
        if (!isSupabaseReady()) return;
        try {
            initSupabase();

            var notices = await dbListNotices();
            saveNotices(notices);

            var schedules = await dbListSchedules();
            saveSchedules(schedules);

            var media = await dbListMedia();
            saveMedia(media);

            var players = await dbListPlayers();
            savePlayers(players);

            var personals = await dbListPersonalRecords();
            savePersonalRecords(personals);

            var pitchers = await dbListPitcherRecords();
            savePitcherRecords(pitchers);

            var story = await dbGetTeamContent('story', STORAGE_KEYS.TEAM_STORY);
            var values = await dbGetTeamContent('values', STORAGE_KEYS.TEAM_VALUES);
            var history = await dbGetTeamContent('history', STORAGE_KEYS.TEAM_HISTORY);
            localStorage.setItem(STORAGE_KEYS.TEAM_STORY, story || '');
            localStorage.setItem(STORAGE_KEYS.TEAM_VALUES, values || '');
            localStorage.setItem(STORAGE_KEYS.TEAM_HISTORY, history || '');

            // 로그인한 사용자의 role 동기화(권한 UI 정확도 향상)
            var a = getAuth();
            if (a && a.playerId) {
                var p = players.filter(function (x) { return x && x.id === a.playerId; })[0] || null;
                if (p && p.role) {
                    a.role = p.role;
                    setAuth(a);
                }
            }
        } catch (e) {
            console.error(e);
            // Supabase 동기화 실패 시 localStorage 모드로 계속 동작
        }
    }

    // =========================
    // LocalStorage -> Supabase migration
    // =========================
    async function migrateLocalToSupabase() {
        if (!isSupabaseReady()) {
            alert('Supabase URL/ANON KEY가 설정되지 않았습니다. script.js의 SUPABASE_URL/SUPABASE_ANON_KEY를 먼저 입력해 주세요.');
            return;
        }
        initSupabase();

        // 1) notices
        var notices = getNotices();
        for (var i = 0; i < notices.length; i++) {
            await dbUpsertNotice(notices[i]);
        }

        // 2) schedules
        var schedules = getSchedules();
        for (var j = 0; j < schedules.length; j++) {
            await dbUpsertSchedule(schedules[j]);
        }

        // 3) media
        var media = getMedia();
        for (var k = 0; k < media.length; k++) {
            await dbUpsertMedia(media[k]);
        }

        // 4) players
        var players = getPlayers();
        for (var p = 0; p < players.length; p++) {
            await dbUpsertPlayer(players[p]);
        }

        // 5) personal records
        var pr = getPersonalRecords();
        for (var r = 0; r < pr.length; r++) {
            if (pr[r] && pr[r].playerId) await dbUpsertPersonalRecord(pr[r]);
        }

        // 6) team content
        await dbSetTeamContent('story', getTeamStory());
        await dbSetTeamContent('values', getTeamValues());
        await dbSetTeamContent('history', getTeamHistory());

        alert('이관 완료: Supabase로 업로드했습니다.');
    }

    var THEME_STORAGE_KEY = 'yagubu_theme';
    var THEME_ORDER = ['light', 'dark', 'dark-blue', 'dark-green', 'dark-purple', 'dark-amoled'];
    var THEME_LABELS = { light: '라이트', dark: '다크(녹색)', 'dark-blue': '다크(블루)', 'dark-green': '다크(그린)', 'dark-purple': '다크(퍼플)', 'dark-amoled': '다크(AMOLED)' };
    var THEME_ICONS = { light: '☀️', dark: '🌙', 'dark-blue': '🔵', 'dark-green': '🟢', 'dark-purple': '🟣', 'dark-amoled': '⬛' };

    function getStoredTheme() {
        try {
            return (localStorage.getItem(THEME_STORAGE_KEY) || '').trim();
        } catch (e) {
            return '';
        }
    }

    function setStoredTheme(theme) {
        try {
            if (THEME_ORDER.indexOf(theme) !== -1) localStorage.setItem(THEME_STORAGE_KEY, theme);
            else localStorage.setItem(THEME_STORAGE_KEY, theme === 'light' ? 'light' : 'dark');
        } catch (e) {}
    }

    function getNextTheme(current) {
        var idx = THEME_ORDER.indexOf(current);
        if (idx === -1) return THEME_ORDER[0];
        return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    }

    function applyTheme() {
        var stored = getStoredTheme();
        var theme = stored;
        if (!theme && typeof window.matchMedia !== 'undefined') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        if (THEME_ORDER.indexOf(theme) === -1) theme = 'light';
        setStoredTheme(theme);
        document.body.setAttribute('data-theme', theme);
        var btn = document.getElementById('themeToggleBtn');
        if (btn) {
            btn.textContent = THEME_ICONS[theme] || '🌙';
            var label = THEME_LABELS[theme] || theme;
            btn.setAttribute('title', '테마: ' + label + ' (클릭 시 다음 테마)');
            btn.setAttribute('aria-label', '테마 전환: ' + label);
        }
    }

    function toggleTheme() {
        var current = document.body.getAttribute('data-theme') || 'light';
        var next = getNextTheme(current);
        setStoredTheme(next);
        applyTheme();
    }

    async function init() {
        applyTheme();
        var themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) themeToggleBtn.addEventListener('click', function () { toggleTheme(); });

        // Supabase + RLS 모드에서는 "인증된 사용자"만 읽기가 가능하므로
        // 세션이 있을 때만 동기화 수행
        if (isSupabaseReady()) {
            try {
                initSupabase();
                var sess = await sb.auth.getSession();
                if (sess && sess.data && sess.data.session) {
                    // 프로필 role 반영
                    var u = sess.data.session.user;
                    var prof = await sb.from('user_profiles').select('role, player_id').eq('id', u.id).maybeSingle();
                    var role = prof.data && prof.data.role ? String(prof.data.role) : '4';
                    var playerId = prof.data && prof.data.player_id ? String(prof.data.player_id) : null;
                    setAuth({ loggedIn: true, playerId: playerId, name: u.email || 'user', role: role, at: Date.now() });
                    invalidateDbCache();
                    await refreshAllViews(true);
                } else {
                    clearAuth();
                }
            } catch (e) {
                console.error(e);
            }
        }
        refreshLoginUi();

        // 리그 선택 초기값(기본: 전체)
        if (leagueSelect) {
            var savedLeague = String(localStorage.getItem(STORAGE_KEYS.LEAGUE_FILTER) || '');
            leagueSelect.value = savedLeague === 'nono' || savedLeague === 'dongguk' ? savedLeague : '';
            leagueSelect.addEventListener('change', withAuth(function (e) {
                if (e && e.preventDefault) e.preventDefault();
                setSelectedLeague(leagueSelect.value || '');
                return refreshAllViews(true);
            }));
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', function () {
                if (isLoggedIn()) logout();
                else openLoginModal();
            });
        }
        if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
        if (loginName) {
            loginName.addEventListener('input', applyLoginEmailFieldByRole);
            loginName.addEventListener('change', applyLoginEmailFieldByRole);
        }

        if (noticeAddBtn) noticeAddBtn.addEventListener('click', withManage(openNoticeAddModal));
        if (noticeMoreBtn) {
            noticeMoreBtn.addEventListener('click', withAuth(function (e) {
                e.preventDefault();
                return openNoticeListModal();
            }));
        }
        if (noticeSearchBtn) noticeSearchBtn.addEventListener('click', withAuth(runNoticeSearch));
        if (noticeListDeleteBtn) noticeListDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleNoticeDeleteSelected(); }));
        if (noticeDeleteBtn) noticeDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleNoticeDeleteFromModal(); }));
        if (noticeAddForm) noticeAddForm.addEventListener('submit', withManage(handleNoticeAddSubmit));

        if (communityAddBtn) communityAddBtn.addEventListener('click', withAuth(function (e) { if (e && e.preventDefault) e.preventDefault(); return openCommunityAddModal(); }));
        if (communityMoreBtn) communityMoreBtn.addEventListener('click', withAuth(function (e) { e.preventDefault(); return openCommunityListModal(); }));
        if (communitySearchBtn) communitySearchBtn.addEventListener('click', withAuth(runCommunitySearch));
        if (communityAddForm) communityAddForm.addEventListener('submit', withAuth(handleCommunityAddSubmit));
        if (communityDeleteBtn) communityDeleteBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (!editingCommunityId) return;
            return handleCommunityDeleteById(editingCommunityId).then(function () {
                closeCommunityAddModal();
            });
        }));
        if (communityPrevBtn) communityPrevBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (communityNavIndex <= 0) return;
            var id = communityNavIds[communityNavIndex - 1];
            if (!id) return;
            communityNavIndex = communityNavIndex - 1;
            return openCommunityViewModal(id, communityNavIds);
        }));
        if (communityNextBtn) communityNextBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (communityNavIndex < 0 || communityNavIndex >= communityNavIds.length - 1) return;
            var id = communityNavIds[communityNavIndex + 1];
            if (!id) return;
            communityNavIndex = communityNavIndex + 1;
            return openCommunityViewModal(id, communityNavIds);
        }));
        if (communityViewEditBtn) communityViewEditBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (!viewingCommunityId) return;
            closeCommunityViewModal();
            return openCommunityEditModal(viewingCommunityId);
        }));
        if (communityViewDeleteBtn) communityViewDeleteBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (!viewingCommunityId) return;
            return handleCommunityDeleteById(viewingCommunityId).then(function () {
                closeCommunityViewModal();
            });
        }));
        if (communityLikeBtn) communityLikeBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (!viewingCommunityId || !isLoggedIn()) return;
            toggleCommunityLike(viewingCommunityId).then(function (res) {
                if (!res) return;
                if (communityLikeCount) communityLikeCount.textContent = res.likeCount;
                communityLikeBtn.classList.toggle('community-like-active', res.likedByMe);
                communityLikeBtn.setAttribute('aria-pressed', res.likedByMe ? 'true' : 'false');
            }).catch(function (err) { console.error(err); });
        }));
        if (communityCommentForm) communityCommentForm.addEventListener('submit', withAuth(handleCommunityCommentSubmit));

        if (galleryAddBtn) galleryAddBtn.addEventListener('click', withAuth(function (e) { if (e && e.preventDefault) e.preventDefault(); return openGalleryAddModal(); }));
        if (galleryMoreBtn) galleryMoreBtn.addEventListener('click', withAuth(function (e) { e.preventDefault(); return openGalleryListModal(); }));
        if (galleryFilterAlbum) galleryFilterAlbum.addEventListener('change', function () { loadGalleryGrid(false); });
        if (galleryFilterTag) galleryFilterTag.addEventListener('change', function () { loadGalleryGrid(false); });
        if (galleryListFilterAlbum) galleryListFilterAlbum.addEventListener('change', function () { loadGalleryFullGrid(false); });
        if (galleryListFilterTag) galleryListFilterTag.addEventListener('change', function () { loadGalleryFullGrid(false); });
        if (galleryAddForm) galleryAddForm.addEventListener('submit', withAuth(handleGalleryAddSubmit));
        if (galleryPhotoFile) galleryPhotoFile.addEventListener('change', withAuth(function (e) {
            if (!galleryPhotoFile || !galleryPhotoFile.files || !galleryPhotoFile.files[0]) return;
            return fileToDataUrl(galleryPhotoFile.files[0]).then(function (url) {
                if (galleryPhotoPreviewImg) galleryPhotoPreviewImg.src = url || '';
                if (galleryPhotoPreview) galleryPhotoPreview.style.display = url ? '' : 'none';
            });
        }));
        if (galleryDeleteBtn) galleryDeleteBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (!editingGalleryId) return;
            return handleGalleryDeleteById(editingGalleryId).then(function () { closeGalleryAddModal(); });
        }));
        if (galleryViewEditBtn) galleryViewEditBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (!viewingGalleryId) return;
            closeGalleryViewModal();
            return openGalleryEditModal(viewingGalleryId);
        }));
        if (galleryViewDownloadBtn) galleryViewDownloadBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            return downloadGalleryViewingImage();
        }));
        if (galleryViewDeleteBtn) galleryViewDeleteBtn.addEventListener('click', withAuth(function (e) {
            if (e && e.preventDefault) e.preventDefault();
            if (!viewingGalleryId) return;
            return handleGalleryDeleteById(viewingGalleryId).then(function () { closeGalleryViewModal(); });
        }));

        if (scheduleAddBtn) scheduleAddBtn.addEventListener('click', withManage(openScheduleAddModal));
        if (seasonScheduleAddBtn) seasonScheduleAddBtn.addEventListener('click', withManage(openScheduleAddModal));
        var seasonScheduleExcelBtn = document.getElementById('seasonScheduleExcelBtn');
        if (seasonScheduleExcelBtn) seasonScheduleExcelBtn.addEventListener('click', function (e) { e.preventDefault(); exportToExcelSchedule(); });
        if (seasonScheduleMoreBtn) seasonScheduleMoreBtn.addEventListener('click', withAuth(function (e) { e.preventDefault(); return openScheduleListModal(); }));
        if (scheduleStatus) scheduleStatus.addEventListener('change', withManage(switchScheduleResultRow));
        if (scheduleDeleteBtn) scheduleDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleScheduleDelete(); }));
        if (scheduleMoreBtn) {
            scheduleMoreBtn.addEventListener('click', withAuth(function (e) {
                e.preventDefault();
                return openScheduleListModal();
            }));
        }
        if (scheduleSearchBtn) scheduleSearchBtn.addEventListener('click', withAuth(runScheduleSearch));
        if (scheduleLeagueFilter) scheduleLeagueFilter.addEventListener('change', withAuth(runScheduleSearch));
        if (scheduleAddForm) scheduleAddForm.addEventListener('submit', withManage(handleScheduleAddSubmit));
        if (gameScorecardSaveBtn) gameScorecardSaveBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleGameScorecardSave(); }));

        var scorecardModal = document.getElementById('gameScorecardModal');
        if (scorecardModal) {
            scorecardModal.addEventListener('change', function (e) {
                if (e.target && e.target.classList && e.target.classList.contains('game-line-player-select') && gameBattingLinesBody && gameBattingLinesBody.contains(e.target)) {
                    var tr = e.target.closest('tr');
                    var posSpan = tr && tr.querySelector('.game-line-pos');
                    if (posSpan && e.target.value) {
                        var pl = (currentScorecardPlayers || []).filter(function (p) { return p.id === e.target.value; })[0];
                        posSpan.textContent = pl ? (pl.primaryPos || '') : '';
                    }
                }
            });
            scorecardModal.addEventListener('input', function (e) {
                if (!e.target || !e.target.classList) return;
                var inBatting = (gameBattingLinesBody && gameBattingLinesBody.contains(e.target)) || (gameOpponentBattingLinesBody && gameOpponentBattingLinesBody.contains(e.target));
                var inPitching = (gamePitchingLinesBody && gamePitchingLinesBody.contains(e.target)) || (gameOpponentPitchingLinesBody && gameOpponentPitchingLinesBody.contains(e.target));
                if (inBatting && (e.target.classList.contains('game-line-ab') || e.target.classList.contains('game-line-h'))) {
                    var tr = e.target.closest('tr');
                    var abEl = tr && tr.querySelector('.game-line-ab');
                    var hEl = tr && tr.querySelector('.game-line-h');
                    var avgEl = tr && tr.querySelector('.game-line-avg');
                    if (avgEl && abEl && hEl) avgEl.textContent = gameBattingAvg(abEl.value, hEl.value);
                } else if (inPitching && (e.target.classList.contains('game-line-ip') || e.target.classList.contains('game-line-er'))) {
                    var tr = e.target.closest('tr');
                    var ipEl = tr && tr.querySelector('.game-line-ip');
                    var erEl = tr && tr.querySelector('.game-line-er');
                    var eraEl = tr && tr.querySelector('.game-line-era');
                    if (eraEl && ipEl && erEl) eraEl.textContent = gamePitchingEra(ipEl.value, erEl.value);
                }
            });
            scorecardModal.addEventListener('click', function (e) {
                var tabBtn = e.target && e.target.closest && e.target.closest('.game-scorecard-tab-btn');
                if (!tabBtn) return;
                e.preventDefault();
                e.stopPropagation();
                var tab = tabBtn.getAttribute('data-scorecard-tab');
                if (!tab) return;
                var panelOur = document.getElementById('scorecardPanelOur');
                var panelOpponent = document.getElementById('scorecardPanelOpponent');
                scorecardModal.querySelectorAll('.game-scorecard-tab-btn').forEach(function (b) {
                    var isActive = b.getAttribute('data-scorecard-tab') === tab;
                    b.classList.toggle('active', isActive);
                    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
                });
                if (panelOur) panelOur.classList.remove('active');
                if (panelOpponent) panelOpponent.classList.remove('active');
                if (tab === 'our' && panelOur) panelOur.classList.add('active');
                else if (tab === 'opponent' && panelOpponent) panelOpponent.classList.add('active');
            });
        }

        if (personalRecordAddBtn) personalRecordAddBtn.addEventListener('click', withManage(function () { return openPersonalRecordModal(null); }));
        var personalRecordExcelBtn = document.getElementById('personalRecordExcelBtn');
        if (personalRecordExcelBtn) personalRecordExcelBtn.addEventListener('click', function (e) { e.preventDefault(); exportToExcelPersonal(); });
        if (personalRecordMoreBtn) personalRecordMoreBtn.addEventListener('click', withAuth(function (e) { e.preventDefault(); return openPersonalRecordListModal(); }));
        if (personalRecordForm) personalRecordForm.addEventListener('submit', withManage(handlePersonalRecordSubmit));
        if (personalRecordDeleteBtn) personalRecordDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handlePersonalRecordDelete(); }));
        if (pitcherRecordAddBtn) pitcherRecordAddBtn.addEventListener('click', withManage(function () { return openPitcherRecordModal(null); }));
        var pitcherRecordExcelBtn = document.getElementById('pitcherRecordExcelBtn');
        if (pitcherRecordExcelBtn) pitcherRecordExcelBtn.addEventListener('click', function (e) { e.preventDefault(); exportToExcelPitcher(); });
        if (pitcherRecordMoreBtn) pitcherRecordMoreBtn.addEventListener('click', withAuth(function (e) { e.preventDefault(); return openPitcherRecordListModal(); }));
        var teamRecordsExcelBtn = document.getElementById('teamRecordsExcelBtn');
        if (teamRecordsExcelBtn) teamRecordsExcelBtn.addEventListener('click', function (e) { e.preventDefault(); exportToExcelTeam(); });
        if (pitcherRecordForm) pitcherRecordForm.addEventListener('submit', withManage(handlePitcherRecordSubmit));
        if (pitcherRecordDeleteBtn) pitcherRecordDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handlePitcherRecordDelete(); }));
        [pitchIp, pitchEr].forEach(function (el) {
            if (el) {
                el.addEventListener('input', syncPitcherEra);
                el.addEventListener('change', syncPitcherEra);
            }
        });
        if (prAB) prAB.addEventListener('input', withManage(syncPersonalComputedFields));
        if (prH) prH.addEventListener('input', withManage(syncPersonalComputedFields));

        if (teamStoryEditBtn) teamStoryEditBtn.addEventListener('click', withManage(openTeamStoryModal));
        if (teamValuesEditBtn) teamValuesEditBtn.addEventListener('click', withManage(openTeamValuesModal));
        if (teamHistoryEditBtn) teamHistoryEditBtn.addEventListener('click', withManage(openTeamHistoryModal));
        if (teamHistoryMoreBtn) teamHistoryMoreBtn.addEventListener('click', withAuth(function (e) { e.preventDefault(); return openTeamHistoryListModal(); }));
        if (teamStoryForm) teamStoryForm.addEventListener('submit', withManage(handleTeamStorySubmit));
        if (teamValuesForm) teamValuesForm.addEventListener('submit', withManage(handleTeamValuesSubmit));
        if (teamHistoryForm) teamHistoryForm.addEventListener('submit', withManage(handleTeamHistorySubmit));
        if (teamStoryDeleteBtn) teamStoryDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleTeamStoryDelete(); }));
        if (teamValuesDeleteBtn) teamValuesDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleTeamValuesDelete(); }));
        if (teamHistoryDeleteBtn) teamHistoryDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleTeamHistoryDelete(); }));
        if (teamHistoryRowAddBtn) teamHistoryRowAddBtn.addEventListener('click', withManage(function () { return openTeamHistoryRowModal(null); }));
        if (teamHistoryRowForm) teamHistoryRowForm.addEventListener('submit', withManage(handleTeamHistoryRowSubmit));
        if (teamHistoryRowDeleteBtn) teamHistoryRowDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleTeamHistoryRowDelete(); }));

        if (playerAddBtn) playerAddBtn.addEventListener('click', withManage(openPlayerAddModal));
        if (playerMoreBtn) playerMoreBtn.addEventListener('click', withAuth(function (e) { e.preventDefault(); return openPlayerListModal(); }));
        if (playerForm) playerForm.addEventListener('submit', withManage(handlePlayerSubmit));
        if (playerDeleteBtn) playerDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handlePlayerDelete(); }));

        if (mediaAddBtn) mediaAddBtn.addEventListener('click', withManage(openMediaAddModal));
        if (mediaEditBtn) mediaEditBtn.addEventListener('click', withManage(openMediaEditModal));
        if (mediaType) mediaType.addEventListener('change', withManage(switchMediaTypeRows));
        if (mediaMoreBtn) {
            mediaMoreBtn.addEventListener('click', withAuth(function (e) {
                e.preventDefault();
                return openMediaListModal();
            }));
        }
        if (mediaSearchBtn) mediaSearchBtn.addEventListener('click', withAuth(runMediaSearch));
        if (mediaAddForm) mediaAddForm.addEventListener('submit', withManage(handleMediaAddSubmit));
        if (mediaDeleteBtn) mediaDeleteBtn.addEventListener('click', withManage(function (e) { if (e && e.preventDefault) e.preventDefault(); return handleMediaDelete(); }));
        setMediaEditButtonState(false);

        setupModals();
        setupSeasonTabs();
        setupTeamTabs();
        applySeasonOnlyView();
        window.addEventListener('hashchange', applySeasonOnlyView);
        await refreshAllViews(false);
    }

    function applySeasonOnlyView() {
        var hash = (window.location.hash || '').toLowerCase().replace(/^#/, '');
        if (hash === 'seasonsection') {
            document.body.classList.add('view-season-only');
        } else {
            document.body.classList.remove('view-season-only');
        }
    }

    // 콘솔에서 실행용 (이관/동기화)
    window.yagubuMigrateLocalToSupabase = function () { return migrateLocalToSupabase(); };
    window.yagubuSyncFromSupabase = function () { return syncAllFromSupabase(); };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { init().catch(console.error); });
    } else {
        init().catch(console.error);
    }
})();
