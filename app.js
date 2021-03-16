const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = 'apikey=d7ccd9f0-bbbd-4cbc-9bd8-5e7b37c2a476'; // USE YOUR KEY HERE

// function fetchObjects() {
//     const url = `${ BASE_URL }/object?${ KEY }`;

//     fetch(url)
//         .then(function (response) {
//             return response.json()
//         })
//         .then(function (response) {
//             console.log(response);
//         })
//         .catch(function (error) {
//             console.error(error);
//         });
// }

// fetchObjects();

async function fetchObjects() {
    onFetchStart();
    const url = `${BASE_URL}/object?${KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        onFetchEnd();
    }
}

fetchObjects().then(x => console.log(x)); // { info: {}, records: [{}, {},]}


async function fetchAllCenturies() {
    onFetchStart();
    const url = `${BASE_URL}/century?${KEY}&size=100&sort=temporalorder`;


    if (localStorage.getItem('centuries')) {
        return JSON.parse(localStorage.getItem('centuries'));
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        const records = data.records;
        const localStorage = records.centuries;

        return records;
    } catch (error) {
        console.error(error);
        onFetchEnd();
    }
}

fetchAllCenturies();
fetchAllCenturies();


async function fetchAllClassification() {
    onFetchStart();
    const url = `${BASE_URL}/classification?${KEY}&size=100&sort=name`;

    if (localStorage.getItem('classifications')) {
        return JSON.parse(localStorage.getItem('classifications'));
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        const records = data.records;
        const localStorage = records.classifications;

        return records;
    } catch (error) {
        console.error(error);
        onFetchEnd();
    }
}


async function prefetchCategoryLists() {
    onFetchStart();

    try {
        const [
            classifications, centuries
        ] = await Promise.all([
            fetchAllClassification(),
            fetchAllCenturies()
        ]);

        // This provides a clue to the user, that there are items in the dropdown
        $('.classification-count').text(`(${classifications.length})`);

        classifications.forEach((classification) => {
            // append a correctly formatted option tag into
            // the element with id select-classification

            $('#select-classification').append($(
                `<option value="${classification.name}">${classification.name}</option>`
            ));
        })

        // This provides a clue to the user, that there are items in the dropdown
        $('.century-count').text(`(${centuries.length}))`);

        centuries.forEach((century) => {
            // append a correctly formatted option tag into
            // the element with id select-century

            $('#select-century').append($(`<option value="value text">${century.name}</option>`))
        });

    } catch (error) {
        console.error(error);
        onFetchEnd();
    }
}

prefetchCategoryLists();


function buildSearchString() {
    const classification = $('#select-classification').val();
    const century = $('#select-century').val();
    const keywords = $('#keywords').val();
    // const url = `${BASE_URL}/object?${KEY}&${classification.Photographs}&${century}&${keywords.face}`;  //review
    const url = 'https://api.harvardartmuseums.org/object?apikey=YOUR_KEY_HERE&classification=Photographs&century=19th%20century&keyword=face';


    $('#search').on('submit', async function (event) {
        // prevent the default
        event.preventDefault();

        try {
            // get the url from `//buildSearchString`
            // fetch it with await, store the result
            // log out both info and records when you get them
            const response = await fetch(url);
            const data = await response.json();
            const records = data.records;
            console.log(data);
            console.log(records);

        } catch (error) {
            // log out the error
            console.error(error);
        }
    });
}

buildSearchString();


function onFetchStart() {
    $('#loading').addClass('active');
}

function onFetchEnd() {
    $('#loading').removeClass('active');
}


function renderPreview(record) {
    // grab description, primaryimageurl, and title from the record
    let preview = $(`
    <div class="object-preview">
        <a href="#">
            <img src="image url" />
            <h3>Record Title</h3>
            <h3>Description</h3>
        </a>
    </div>
    `)

    if (record.data === undefined) {
        // #1: Something goes here
        return Promise.reject(null);
      }

      return preview;

    /*
    Template looks like this:
  
    <div class="object-preview">
      <a href="#">
        <img src="image url" />
        <h3>Record Title</h3>
        <h3>Description</h3>
      </a>
    </div>
  
    Some of the items might be undefined, if so... don't render them
  
    With the record attached as data, with key 'record'

    /* render a single album 
     function renderAlbum(album) {
       let albumCard = $(`
       <div class="album-card">
        <header>
        <h3>${album.title}, by ${album.user.username} </h3>
            </header>
             <section class="photo-list">
              <div class="photo-card"></div>
                <div class="photo-card"></div>
                <div class="photo-card"></div>
                  <!-- ... -->
               </section>
                 </div>
                 `);
                   album.photos.forEach(function(photo) {
                     $('.photo-list').append(renderPhoto(photo));
                    });
                      return albumCard;
                    }
    */

    // return new element
}


function updatePreview(records) {
    const root = $('#preview');

    $('.results').empty();

    records.forEach((record) => {
        $('#preview').append(renderPreview());
    })

    updatePreview();


    // grab the results element, it matches .results inside root
    // empty it
    // loop over the records, and append the renderPreview


    centuries.forEach((century) => {
        // append a correctly formatted option tag into
        // the element with id select-century

        $('#select-century').append($(`<option value="value text">${century.name}</option>`))
    });

}




$('#preview .next, #preview .previous').on('click', async function () {
    /*
      read off url from the target 
      fetch the url
      read the records and info from the response.json()
      update the preview
    */
  });