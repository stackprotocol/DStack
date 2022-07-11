package verifbs

import (
	bstore "github.com/ipfs/go-ipfs-blockstore"
)

type VerifBSGC struct {
	bstore.GCBlockstore
}
